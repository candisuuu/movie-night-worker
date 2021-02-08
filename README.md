# Movie Night Cloudflare Worker

> A Cloudflare worker that serves a serverless API for my discord server's movie night app

## Installing / Getting started

1. In the Workers section of the Cloudflare dashboard click the KV tab
2. Enter "mnData" in the Namespace Name input box and click Add
3. Click the View button next to the new Namespace Name
4. Enter "votesAll" in the input area for Key and [] in the input area for Value
5. Click Add Entry
6. Go to the Workers tab and create a new worker with the name of your choice
7. Go to the Settings tab in the new worker
8. Select the Edit variables option under KV Namespace Bindings
9. Click Add Binding
10. Enter "mnData" for VARIABLE_NAME and select "mnData" from the KV namespace dropdown menu
11. Click the Save button
12. Scroll to the top and click on the Quick edit button
13. Copy and paste the JS code from movie-night-worker.js into the code editor, click Save and Deploy, and confirm
14. Your worker is now live!

## TESTING
To test if your worker works - while in the worker quick editor you can emulate a POST or GET request.

## TODO
* Add way to retrieve top 5 most upvoted movies and return in a separate call, such as /api/top5
