# Python crawler that monitors the service

write the crawling process in crawl function in crawl.py

## How to work

- Script is launched every minute of TIME_EPOCH

- Get epoch with getEpoch()

- Get the IP address to crawl with getUsers()

- Crawling

  - Make sure the service is live

  - Get the Flag from score server with generateFlag(user, service, epoch)

  - Send a flag to the service

  - Get the stored flags from the service

  - Check for the right flag with validateFlag(flag)

- If the crawl passes all the way through, send it to the score server with sendStatus(user, service, epoch)
