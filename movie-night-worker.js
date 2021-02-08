addEventListener('fetch', event => {
  event.passThroughOnException()
  event.respondWith(router(event))
})

/**
 * Submit trailer data to Movie Night KV storage
 * POST /api/trailer?id=tt3195845
 */
const submitTrailer = async (event, id, data) => {
  // post new data
  try {
    const allData = JSON.parse(await mnData.get('votesAll'))
    const newData = JSON.parse(data)
    let combinedData = allData

    // check if movie is already in DB
    const movie = allData.filter(movie => movie.imdbID === id)

    if (movie[0])
      movie[0].Trailer = newData.Trailer
    else
      combinedData = allData.concat(newData)

    event.waitUntil(mnData.put('votesAll', JSON.stringify(combinedData)))

    return handleSuccess({
      msg: 'data successfully stored',
      data: combinedData,
      success: true
    })
  } catch(err) {
    return handleError(err)
  }
}

/**
 * Submit voting data to Movie Night KV storage
 * POST /api/vote?id=tt3195845
 */
const submitVote = async (event, id, data) => {
  // post new data
  try {
    const allData = JSON.parse(await mnData.get('votesAll'))
    const newData = JSON.parse(data)
    let combinedData = allData

    // check if movie is already in DB
    const movie = allData.filter(movie => movie.imdbID === id)

    if (movie[0])
      movie[0].Votes = movie[0].Votes.concat(newData.Votes)
    else
      combinedData = allData.concat(newData)

    event.waitUntil(mnData.put('votesAll', JSON.stringify(combinedData)))

    return handleSuccess({
      msg: 'data successfully stored',
      data: combinedData,
      success: true
    })
  } catch(err) {
    return handleError(err)
  }
}

/**
 * Retrieve voting data from Movie Night KV storage
 * GET /api/vote
 */
const getVotes = async (event, id) => {
  const data = JSON.parse(await mnData.get('votesAll'))
  const movie = data.filter(movie => movie.imdbID === id);
  return handleSuccess(movie)
}

const handleSuccess = (msg) => {
  return new Response(JSON.stringify(msg),  {
		status: 200,
		statusText: 'OK',
		headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json',
		},
  })
}

const handleError = (msg) => {
  return new Response(JSON.stringify(msg),  {
		status: 500,
		statusText: 'OK',
		headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json',
		},
  })
}

/**
 * Fetch and log a request
 * @param {Request} request
 */
const actionRegex = new RegExp('api/([^/]*)', 'i')
async function router(event) {
  const request = event.request

  const url = new URL(request.url)
  const method = request.method.toLowerCase()
  const actionMatch = actionRegex.exec(url.pathname)
  let action = ''
  if (!actionMatch)
    return handleError({
      message: `These routes are available: /api/(trailer | vote)`
    })
  else 
    action = actionMatch[1]
    
  let movieId = url.search ? url.search.slice(4) : ''
    
  // return appropriate cors headers for initial options method
  if (method == 'options') {
    return new Response('', {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-type',
        'Access-Control-Max-Age': '86400'
      }
    })
  } else if (method == 'post' && action == 'trailer') {
    let jsonText = await request.text()
    return submitTrailer(event, movieId, jsonText)
  } else if (method == 'post' && action == 'vote') {
    let jsonText = await request.text()
    return submitVote(event, movieId, jsonText)
  } else if (method == 'get' && action == 'vote') {
    return getVotes(event, movieId)
  } else {
    const siteResponse = await fetch(request)
    return handleError({
      message: `We cannot support the route you requested. These routes are available: /api/(trailer | vote)`
    })
  }

}
