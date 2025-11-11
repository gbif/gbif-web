import React, { useState, useContext, useEffect, useCallback } from 'react';
import EventContext from '../../../SearchContext';
import SiteContext from '../../../../dataManagement/SiteContext'
import { useDialogState } from "reakit/Dialog";
import * as styles from './downloadPresentation.styles';
import {Button, Popover, Progress, Skeleton} from '../../../../components';
import env from '../../../../../.env.json';
import {FilterContext} from "../../../../widgets/Filter/state";
import {filter2predicate} from "../../../../dataManagement/filterAdapter";
import {FormattedNumber} from "react-intl";
import {useQuery} from "../../../../dataManagement/api";
import * as style from "../List/style";

export const DownloadPresentation = ({ more, size, data, total, loading }) => {

  const dialog = useDialogState({ animated: true, modal: false });
  const items = data?.eventSearch?.facet?.datasetKey || [];

  if (loading){
    return <>Loading...</>;
  }

  if (!items || items.length == 0){
    return <>No datasets matching this search are available for download</>;
  }

  return <>
    <div>
        <ul key={`dataset_results`} style={{ padding: 0, margin: 0 }}>
          {items.length > 0 && items.map((item, index) => <li key={`dataset_results_${item.key}`}>
            <DatasetResult
                index={index}
                dialog={dialog}
                key={item.key}
                item={item}
                largest={items[0].count}
            />
          </li>)}
        </ul>
    </div>
  </>
}

const DATASET_QUERY = `
query list($datasetKey: JSON){
  eventSearch(predicate: {type: equals, key: "datasetKey", value: $datasetKey}) {
    documents(size: 1) {
      total
      results {
        occurrenceCount
      }
    }
  }
}
`;

function DatasetSkeleton() {
  return <div css={style.datasetSkeleton}>
    <Skeleton width="random" style={{ height: '1.5em' }} />
  </div>
}


function DatasetResult({ largest, item, indicator, theme,  index, dialog,...props }) {

  const [visible, setVisible] = useState(false);
  const isAvailable = item.archive.fileSizeInMB != null;
  const { data, error, loading, load } = useQuery(DATASET_QUERY, { lazyLoad: true });

  const datasetKey = item.key;

  useEffect(() => {
    load({ keepDataWhileLoading: true, variables: { datasetKey } });
  }, [datasetKey]);

  if (!data || loading) return <DatasetSkeleton />;

  return <div css={styles.dataset({ theme })}>
    <a css={styles.actionOverlay({theme})} href={`${item.key}`} onClick={(event) => {
      if (
        event.ctrlKey ||
        event.shiftKey ||
        event.metaKey || // apple
        (event.button && event.button == 1) // middle click, >IE9 + everyone else
      ) {
        return;
      } else {
        dialog.show();
        event.preventDefault();
      }
    }}></a>
    <div css={styles.title({ theme })}>
      <div style={{ flex: '1 1 auto' }}>
        {item.datasetTitle}
        {isAvailable && <div>
          <span>Compressed archive size: {item.archive.fileSizeInMB}MB</span>
          <br/>
          <span>Format: Darwin core archive / Frictionless data package</span>
          <br/>
          <span>Last generated: {item.archive.modified}</span>
          <div css={styles.title({ theme })}>
            <span>
              <FormattedNumber value={(item.events.documents.total / data?.eventSearch.documents.total) * 100 } />%
               of dataset matches search
            </span>
          </div>
          <Progress percent={100 * (item.events.documents.total / data?.eventSearch.documents.total)} />
        </div>}
      </div>
      <div>
        {isAvailable && <div>
              <Popover
                  trigger={<Button onClick={() => setVisible(true)}>Download</Button>}
                  visible={visible}>
                <ParentThatFetches hide={() => setVisible(false)}  dataset={item}/>
              </Popover>
        </div>}

        {!isAvailable && <div>
          <Button  look="primaryOutline" disabled={true} >
            Not currently available for download
          </Button>
        </div>}

      </div>
    </div>
  </div>
}

export function  ParentThatFetches ({hide, dataset}) {
  const [user, setUser] = useState();
  const siteContext = useContext(SiteContext);
  useEffect(() => {
    const getData = async () => {
      const user = await siteContext.auth?.getUser()
      setUser(user);
    }
    getData();
  }, []);

  return <>
    {user && <DownloadForm user={user} hide={hide} dataset={dataset}/>}
    {!user &&
        <div style={{ padding: "15px 30px 30px 30px" }}>
          <h3>Please login to download</h3>
          <p>
            Please log in to download.
          </p>
          <Button onClick={() => siteContext.auth.signIn()} look="primaryOutline" style={{marginRight: '6px'}}>Login</Button>
          <Button onClick={() => hide()} look="primaryOutline">Close</Button>
        </div>}
  </>
}

export function DownloadForm ({  hide, dataset, user }) {

  const siteContext = useContext(SiteContext);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(EventContext);

  const [fullDownloadStarted, setFullDownloadStarted] = useState(false);
  const [filteredDownloadStarted, setFilteredDownloadStarted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [downloadStatusDetailed, setDownloadStatusDetailed] = useState("");

  const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    };


  let predicateNotEmpty = false;

  // {"type":"and","predicates":[{"type":"in","key":"datasetKey","values":["dr18391"]}]}
  if (predicate && predicate.predicates && predicate.predicates[0].type != "and"){
    // single predicate defined
    predicateNotEmpty = true;
  }

  //{"type":"and","predicates":[{"type":"and","predicates":[{"type":"in","key":"datasetKey","values":["dr18391"]},{"type":"range","key":"year","value":{"gte":"2001","lte":"2022"}}]}]}
  if (predicate && predicate.predicates && predicate.predicates[0].type == "and" && predicate.predicates[0].predicates && predicate.predicates[0].predicates.length > 0){
    // multiple predicate defined
    predicateNotEmpty = true;
  }

  const validateEmail = (email) => {
    if (!email) {
      return false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      return false;
    }
    return true;
  }


  async function startFullDownload() {
    if (user) {
      window.location.href = dataset.archive.url;
      return {success: true}
    } else {
      siteContext.auth.signIn();
    }
  }

  async function startFilteredDownload() {
    const signIn = siteContext.auth?.signIn;

    if (user) {
       const email = user.profile?.email;
       if (validateEmail(email)) {
         // remove OIDC code
         const searchUrl = new URL(window.location.href)
         searchUrl.searchParams.delete('code')
         // validate the predicate - is there any filters set ?
         let download = {
           "datasetId": dataset.key,
           "creator": user.profile.email,
           "notificationAddresses": [user.profile.email],
           "predicate": predicate,
           "eventQueryUrl": searchUrl.toString()
         }

         const response = await fetch(env.DOWNLOADS_API_URL + '/event/download', {
           method: 'POST',
           mode: 'cors',
           headers: {
             'Content-Type': 'application/json; charset=UTF-8',
             'Authorization': `Bearer ${user.access_token}`
           },
           body: JSON.stringify(download)
         })

         if (response.ok) {
           return {success: true}
         } else {
           return {success: false, status: "Access API gateway denied!", error: response.status}
         }
       } else {
         return {success: false, status: 400, error: `Invalid creator: ${email}`}
       }

    } else if (signIn) {
      signIn();
    }
  }

  const fullDownload = useCallback(() => {
    setDownloadStatus("Checking user....");
    setDownloadStatusDetailed("Checking the user is logged in....");
    startFullDownload().then((result) => {
      if (result.success) {
        setDownloadSuccess(true);
        setDownloadStatus("Download started !")
        setDownloadStatusDetailed("Your download has started")
      }
    });
    setFullDownloadStarted(true);
    setDownloadStarted(true);
  })

  const filteredDownload = useCallback(() => {

    setDownloadStatus("Checking user....");
    setDownloadStatusDetailed("Checking the user is logged in....");

    setFilteredDownloadStarted(true);
    setDownloadStarted(true);
    startFilteredDownload()
        .then((result) => {
          if (result.success){
            setDownloadSuccess(true);
            setDownloadStatus("Download started !")
            setDownloadStatusDetailed("Your download has started")
          } else {
            setDownloadSuccess(false);
            setDownloadStatus(`There was a problem (${result.status}), your download has not started. !`)
            if (result.status == 401) {
              setDownloadStatusDetailed("Authentication failed, please sign in again!");
            } else if (result.status == 400 ) {
              setDownloadStatusDetailed(`Error: ${result.error}`);
            }
          }
        });
  })

  return <div style={{ padding: "15px 30px 30px 30px" }}>
      {fullDownloadStarted &&
        <PostFullDownloadForm hide={hide} downloadStatus={downloadStatus} downloadStatusDetailed={downloadStatusDetailed} />
      }

      {filteredDownloadStarted &&
        <PostFilteredDownloadForm hide={hide} downloadStatus={downloadStatus} downloadStatusDetailed={downloadStatusDetailed} downloadSuccess={downloadSuccess}/>
      }

      {!downloadStarted &&
          <PreDownloadForm
              startFullDownload={fullDownload}
              startFilterDownload={filteredDownload}
              predicateNotEmpty={predicateNotEmpty}
              hide={hide}
              dataset={dataset}
          />
      }
  </div>
}

export function PostFullDownloadForm({ hide, downloadStatus, downloadStatusDetailed }) {
  return <>
    <h3>{downloadStatus}</h3>
    <p>{downloadStatusDetailed}</p>
    <Button onClick={() => hide()} look="primaryOutline">Close</Button>
  </>
}

export function PostFilteredDownloadForm({ hide, downloadStatus, downloadStatusDetailed, downloadSuccess }) {
  return <>
    <h3>{downloadStatus}</h3>
    <p>{downloadStatusDetailed}</p>
    {downloadSuccess &&
        <p>
          The download will take approximately 10 minutes to create.
          <br/>
          After this time, you will receive an email sent to <br/>
          your registered email address with a link.
        </p>
    }
    <Button onClick={() => hide()} look="primaryOutline">Close</Button>
  </>
}

export function PreDownloadForm({ hide, dataset, startFullDownload, startFilterDownload, predicateNotEmpty }) {
  return <>
        <div>
          <h3>Download full dataset</h3>
          <p>
            To download the full dataset in zip format, click the "Download full dataset" button. <br/>
            This download will start immediately. The file size is {dataset.archive.fileSizeInMB}MB.<br/>
            <br/>
            <Button onClick={() => startFullDownload()} look="primaryOutline">Download full dataset</Button>
          </p>

          {predicateNotEmpty &&
              <div>
                <hr/>
              </div>
          }

          {predicateNotEmpty && <div>
            <h3>Download filtered dataset</h3>
            <p>
              To download the dataset filtered to your search, <br/>
              click the "Download filtered dataset"  button.<br/>
              This will take about 10 minutes to generate a zip file. <br/>
              Once generated, you'll received an email with a link. <br/>
              <br/>
              <Button onClick={() => startFilterDownload()} look="primaryOutline">Download filtered dataset</Button>
            </p>
            <hr/>
          </div> }

          <br/>
          <Button onClick={() => hide()} look="primaryOutline">Close</Button>
        </div>
  </>
}

DownloadForm.displayName = 'DownloadForm';