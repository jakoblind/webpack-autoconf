import memoizee from 'memoizee'

export default memoizee(name =>
  fetch(`https://unpkg.com/${name}/package.json`)
    .then(res => res.json())
    .then(
      r => {
        return '^' + r.version
      },
      { promise: true }
    )
    .catch(err => {
      return 'latest'
    })
)
