import React, { useState, useContext, useEffect, useCallback } from 'react';
import EventContext from '../../../SearchContext';
import SiteContext from '../../../../dataManagement/SiteContext'
import { useDialogState } from "reakit/Dialog";
import * as styles from './downloadPresentation.styles';
import {Button, Popover, Skeleton} from '../../../../components';
import env from '../../../../../.env.json';

export const DownloadPresentation = ({ more, size, data, total, loading, getPredicate }) => {
  const siteContext = useContext(SiteContext);
  const { labelMap } = useContext(EventContext);
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });
  const items = data?.eventSearch?.facet?.datasetKey || [];
  const [activePredicate, setActivePredicate] = useState();
  const [predicateEmpty, setPredicateEmpty] = useState(true);

  useEffect(() => {
    setActiveItem(items[activeId]);
    setActivePredicate(getPredicate())
    let predicate = getPredicate();
    if (predicate && predicate.predicates && predicate.predicates[0].type != "and"){
      setPredicateEmpty(false)
    }
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [activeId]);

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
                activePredicate={activePredicate}
                predicateEmpty={predicateEmpty}
                setActive={setActive}
                index={index}
                dialog={dialog}
                key={item.key}
                item={item}
                largest={items[0].count}
                siteContext={siteContext}
            />
          </li>)}
        </ul>
    </div>
  </>
}

function DatasetResult({ largest, item, indicator, theme, setActive, index, dialog, activePredicate, predicateEmpty,
                         siteContext,...props }) {

  const [visible, setVisible] = useState(false);
  const [downloadFailure, setDownloadFailure] = useState(false);
  const isAvailable = item.archive.fileSizeInMB != null;

  async function startFullDownload(dataset) {

    const getUser = siteContext.auth?.getUser;
    if (siteContext.auth && getUser) {
      const user = await getUser();
      if (user) {
        // validate the predicate - is there any filters set ?
        window.location.href = dataset.archive.url;
      } else if (siteContext.auth?.signIn) {
        siteContext.auth.signIn();
      }
    } else {
      console.log("Site context didnt provide a getUser function")
    }
  }

  async function startFilteredDownload() {

    const signIn = siteContext.auth?.signIn;
    const getUser = siteContext.auth?.getUser;

    if (siteContext.auth && getUser) {
      const user = await getUser();
      if (user) {
        // validate the predicate - is there any filters set ?
        console.log(user);
        let download = {
          "datasetId": item.key,
          "creator": user.profile.sub,
          "notificationAddresses": [user.profile.sub],
          "predicate": activePredicate
        }

        let request = new XMLHttpRequest();
        request.open('POST', env.DOWNLOADS_API_URL + '/event/download', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', 'Bearer ' + user.access_token);
        request.send(JSON.stringify(download));

        if (request.status != 200){
          setDownloadFailure(true);
          console.log(request.statusText);
        }

      } else if (signIn) {
        signIn();
      }
    } else {
      console.log("Site context didnt provide a getUser function")
    }
  }

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
        setActive(index);
        dialog.show();
        event.preventDefault();
      }
    }}></a>
    <div css={styles.title({ theme })}>
      <div style={{ flex: '1 1 auto' }}>
        {item.datasetTitle}
        {isAvailable && <div>
          <br/>
          <span>Compressed archive size: {item.archive.fileSizeInMB}MB</span>
          <br/>
          <span>Format: Darwin core archive / Frictionless data package</span>
          <br/>
          <span>Last generated: {item.archive.modified}</span>
        </div>}
      </div>
      <div>

        {isAvailable && <div>
        <Popover
            trigger={<Button onClick={() => setVisible(true)} disabled={predicateEmpty} style={{ marginRight: 6 }}>Download filtered
              archive</Button>}
            onClickOutside={action => console.log('close request', action)}
            visible={visible}>
          <FilteredDownloadForm
              hide={() => setVisible(false)}
              download={() => startFilteredDownload()}
              activePredicate={activePredicate}
              siteContext={siteContext}
          >
          </FilteredDownloadForm>
        </Popover>
        <Button onClick={() => { startFullDownload(item); }}  look="primaryOutline">
          Download full dataset archive
        </Button>
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

function UnsupportedFilter({filterName, hide}) {
  return <div style={{ padding: "30px" }}>
    <h3>Downloads with {filterName} filter coming soon!</h3>
    <p>
      Downloads with {filterName} filter are currently supported
      <br/>
      in this prototype.
      <br/>
      <br/>
      We'll add this very soon !
    </p>
    <br/>
    <Button onClick={() => hide()} look="primaryOutline">Close</Button>
  </div>
}


const FilteredDownloadForm = React.memo(({ focusRef, hide, download, siteContext, activePredicate,...props }) => {

  const isUserLoggedIn = siteContext.auth?.getUser != null;
  const signIn = siteContext.auth?.signIn;

  const [downloadButtonText, setDownloadButtonText] = useState("Download");
  const [downloadDisabled, setDownloadDisabled] = useState(false);
  const [downloadSent, setDownloadSent] = useState(false);

  const startDownload = useCallback(() => {
    console.log("Starting download");

    // change button
    setDownloadDisabled(true);
    setDownloadButtonText("Requesting download....");

    download();

    // change button
    setDownloadButtonText("Download sent!");
    setDownloadSent(true)
  }, []);

  // temp code to check for unsupported filters
  if (activePredicate.predicates[0].predicates && Array.isArray(activePredicate.predicates[0].predicates)){
    activePredicate.predicates[0].predicates.forEach((predicate, idx) => {
      if (predicate.key == "taxonKey") {
        return <UnsupportedFilter filterName={`taxonKey`} hide={hide} />
      }
      if (predicate.key == "measurementOrFactTypes") {
        return <UnsupportedFilter filterName={`measurementOrFactTypes`} hide={hide} />
      }
    });
  } else {
    if (activePredicate.predicates[0].key == "taxonKey") {
      return <UnsupportedFilter filterName={`taxonKey`} hide={hide} />
    }
    if (activePredicate.predicates[0].key == "measurementOrFactTypes") {
      return <UnsupportedFilter filterName={`measurementOrFactTypes`} hide={hide} />
    }
  }

  return <div style={{ padding: "30px" }}>

    {!downloadSent &&
      <h3>Download data for this search</h3>
    }

    {downloadSent &&
        <h3>Download started !</h3>
    }

    { isUserLoggedIn && <div>
        {!downloadSent && <p>
        This will create a download of this dataset filtered to your search.
          <br/>
          Once the download is generated you'll receive an email with a link <br/>
          you can use to download the data.
          <br/>
        </p>
        }

        {downloadSent && <p>
          The download will take approximately 10 minutes to create.
          <br/>
          After this time, you will receive an email sent to <br/>
          your registered email address with a link.
        </p>
        }
        <br/>
      <div>
        <Button onClick={startDownload} ref={focusRef} disabled={downloadDisabled}>{downloadButtonText}</Button>
        <Button onClick={() => hide()} look="primaryOutline">Close</Button>
      </div>
    </div> }
    { !isUserLoggedIn && <div>
      <p>You need to login to download</p>
      <a href={`#`} onClick={signIn}>Click here</a> to login
      <br/>
      <br/>
      <Button onClick={() => hide()} look="primaryOutline">Close</Button>
    </div> }
  </div>
});
FilteredDownloadForm.displayName = 'FilteredDownloadForm';