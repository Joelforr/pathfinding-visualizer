//Utility to help create abortable async calls using generator functions
//Code from Google Web Dev Article
//https://dev.to/chromiumdev/cancellable-async-functions-in-javascript-5gp7

export function makeSingleGenerator(component, generator) {
  let globalNonce;
  return async function(...args) {
    const localNonce = (globalNonce = {});

    const iter = generator(...args);

    let resumeValue;
    for (;;) {
      const n = iter.next(resumeValue);
      if (n.done) {
        return n.value; // final return value of passed generator
      }

      // whatever the generator yielded, _now_ run await on it
      resumeValue = await n.value;
      if (localNonce !== globalNonce) {
        return; // a new call was made
      }

      if (component.state.isSearching === false) {
        return;
      }

      // next loop, we give resumeValue back to the generator
    }
  };
}
