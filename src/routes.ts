import { createCheerioRouter, Dataset } from 'crawlee';

export const router = createCheerioRouter();
const CLUTCH_URL = 'https://clutch.co';


router.addDefaultHandler(async ({ $, enqueueLinks, request, log }) => {
    const urls = $('ul.directory-list li.website-profile > a');
    log.info(`Found links: ${urls.length}`);
    const profileUrls = urls.map((_, element) => {
        return { url: `${CLUTCH_URL}${$(element).attr('href')}` };
    }).get();

    await Dataset.pushData(profileUrls);

    // Find the "Next" button and enqueue the next page of results (if it exists)
    const nextButton = $('li.page-item.next a.page-link');
    if (nextButton) {
        log.info(`Enqueueing pagination for: ${request.url}`);
        await enqueueLinks({
            selector: 'li.page-item.next a.page-link',
        });
    }
});
