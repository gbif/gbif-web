const _ = require('lodash');
const terms = require('./terms.json')
const remarkTypes = require('./remarkTypes.json')

const remarkMap = remarkTypes.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
}, {})

const groupedTerms = terms.reduce((acc, cur) => {
    _.set(acc, `${cur.group}.${cur.simpleName}`, cur)
    return acc
}, {})

const getRemarks = ({value, verbatim}) => {
    if(!verbatim){
        return "inferred"
    } else if(value != verbatim){
        return "altered"
    } else { return null}

}
  module.exports = Object.keys(groupedTerms).reduce((acc, cur) => {
    acc[cur] = (occurrence) => {
      const fieldIssues = occurrence.issues.reduce((y, x) => {
                remarkMap[x].relatedTerms.forEach( t => {
                    if(y[t]){
                        y[t].push(_.pick(remarkMap[x], ['id', 'severity']))
                    } else {
                        y[t] = [_.pick(remarkMap[x], ['id', 'severity'])]
                    }
                })
                return y;
      }, {})
      return Object.keys(groupedTerms[cur]).reduce((a,c) => {
        const value = groupedTerms[cur][c].esField ? _.get(occurrence, groupedTerms[cur][c].esField) : _.get(occurrence, groupedTerms[cur][c].simpleName) ?  _.get(occurrence, groupedTerms[cur][c].simpleName) : _.get(occurrence, `verbatim.core["${groupedTerms[cur][c].qualifiedName}"]`)
            if(value){
                a[c] =  {
                    value,
                    verbatim: _.get(occurrence, `verbatim.core["${groupedTerms[cur][c].qualifiedName}"]`)
                }
                if( getRemarks(a[c])){
                    a[c].remarks = getRemarks(a[c])
                }
                if(fieldIssues[groupedTerms[cur][c].qualifiedName]){
                    a[c].issues = fieldIssues[groupedTerms[cur][c].qualifiedName]
                } 
            }   
                return  a;
            
      }, {})
    }
    return acc;
  }, {});

