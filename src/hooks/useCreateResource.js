import { defer } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";

export function createResource(url) {
  let _url = url;
  let dataRef = null;
  let status = "Pending";
  let ajaxRef = null;

  const fetchObservable = defer(() =>
    ajax(_url).pipe(map((res) => res.response))
  );

  return {
    read() {
      if (status === "Pending") {
        if (ajaxRef instanceof Promise) {
          throw ajaxRef;
        }
        ajaxRef = fetchObservable.toPromise(); // Start Fetching

        throw ajaxRef
          .then((data) => {
            dataRef = data;
            status = "Resolve";
          })
          .catch(() => {
            status = "Reject";
          });
      }

      if (status === "Reject") {
        return [];
      }

      if (status === "Resolve") {
        return dataRef;
      }
    },

    reRead() {
      status = "Pending";
      ajaxRef = null;
    },
    readNew(newUrl) {
      _url = newUrl;
      ajaxRef = null;
      status = "Pending";
    }
  };
}
