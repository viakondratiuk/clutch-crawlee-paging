import { createCheerioRouter, Dataset } from 'crawlee';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ $, enqueueLinks, request, log }) => {
    const profileUrls = $('ul.directory-list h3.company_info > a').map((_, element) => {
        return { url: $(element).attr('href') };
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
