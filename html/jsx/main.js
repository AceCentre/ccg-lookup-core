import 'compat'
import _ from 'lodash'
import config from 'config'
import showdown from 'showdown'
import PapaParse from 'papaparse'
import strformat from 'string-format'

let $get = (a) => document.getElementById(a)
let $new = (a) => document.createElement(a)

function ondomready() {
  let lookup_form = $get('ccg-lookup-form')
  if(!lookup_form) {
    console.info("ccg-lookup terminate, Could not find #ccg-lookup-form")
    return;
  }
  lookup_form.addEventListener('submit', lookup_form_submit, false);
  let service_input = $get('ccg-service-input')
  if(!service_input)
    throw new Error("Could not find service or postcode inputs for ccg");
  _.each(config.services, (service) => {
    let opt = $new('option')
    opt.value = service.name
    opt.innerHTML = service.name
    service_input.appendChild(opt)
  });
}
document.addEventListener('DOMContentLoaded', ondomready, false);

function lookup_form_submit(evt) {
  evt.preventDefault()
  let service_input = $get('ccg-service-input')
  let postcode_input = $get('ccg-postcode-input')
  if(!service_input || !postcode_input)
    throw new Error("Could not find service or postcode inputs for ccg");
  let service = _.find(config.services, (a) => a.name == service_input.value)
  if(!service)
    throw new Error("Could not find service of name: "+ service_input.value);
  ccg_lookup(service, postcode_input.value)
    .catch((err) => {
      alert(err)
    });
}

async function ccg_lookup(service, postcode) {
  let outputs = await Promise.all([
    http_get(strformat(config.get_postcode_url, {postcode})),
    http_get(service.table)
  ])
  let response = JSON.parse(outputs[0])
  if(response.status == 200) {
    let result = response.result
    let tableinfo = PapaParse.parse(outputs[1], {
      header: true
    });
    let table = tableinfo.data;
    // apply search
    let foundrow = null;
    for(let row of table) {
      let tmp = result
      for(let key of service.postcodes_lookup_path) {
        tmp = tmp[key]
        if(!tmp)
          break;
      }
      if(tmp) {
        if(tmp == row[service.table_match_field]) {
          foundrow = row
          break;
        }
      } else {
        throw new Error(strformat("Could not find {0}, in path {1}", key,
                                  service.postcodes_lookup_path.join(",")))
      }
    }
    if(foundrow == null) {
      throw new Error("No match!")
    } else {
      // print the result
      try {
        let vars = {
          service_name_LOWER: service.name.toLowerCase(),
        };
        for(let field of tableinfo.meta.fields) {
          vars[field] = foundrow[field]+''
          vars[field + "_LOWER"] = (foundrow[field]+'').toLowerCase()
        }
        let details_md = await http_get(strformat(service.get_details_url, vars))
        let result_el = $get('ccg-lookup-result')
        result_el.innerHTML = ''
        let pairs_dl = $new('dl')
        pairs_dl.setAttribute('class', 'ccg-lookup-pairs')
        result_el.appendChild(pairs_dl)
        // print pairs
        for(let pinf of service.info_pairs) {
          let dt = $new('dt')
          let dd = $new('dd')
          dt.innerHTML = pinf.label
          dd.innerHTML = foundrow[pinf.key]
          pairs_dl.appendChild(dt)
          pairs_dl.appendChild(dd)
        }
        let details_el = $new('div')
        result_el.appendChild(details_el)
        details_el.setAttribute('class', 'ccg-lookup-details')
        let converter = new showdown.Converter({
          tables: true
        })
        details_el.innerHTML = converter.makeHtml(details_md)
      } catch(err) {
        console.warn(err)
      }
    }
  } else {
    throw new Error("Unexpected response from postcodes.io, " + JSON.stringify(response))
  }
}

function http_get(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", url)
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4) {
        if(xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          let err = new Error(xhr.status + " " + xhr.statusText);
          err.xhr = xhr
          reject(err)
        }
      }
    };
    xhr.send()
  });
}

