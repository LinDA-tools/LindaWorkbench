    if (TUTORIAL_STEP == 1) {
        //introductory text
        $().ready(function() {
            tooltip('.vocabulary-search-form input[type="submit"]',
                    'Welcome to the LinDA Vocabulary Repository!<br />In this tutorial, you will understand <span class="green-text">how</span> to use the vocabulary repository and <span class="green-text">why</span> it\'s important to use term vocabularies for your data.',
                    'right'
            );

            setTimeout(function() {
                tooltip('.search-filters a:nth-of-type(1)',
                        'The Vocabulary Repository contains a list of Vocabularies - lists of terms that describe things in different domains.',
                        'right'
                );

                setTimeout(function() {
                    window.location.href = $('.search-filters a:nth-of-type(2)').attr('href') + '?tutorial=true&step=2';
                }, INTERVAL_LONG);
            }, INTERVAL_LONG);
        });
    }

    if (TUTORIAL_STEP == 2) {
        tooltip('.search-filters a:nth-of-type(2)',
                'The <span class="green-text">Classes</span> tab contains data types defined by the vocabularies in the system.',
                'right'
        );

        setTimeout(function() {
             window.location.href = $('.search-filters a:nth-of-type(3)').attr('href') + '?tutorial=true&step=3';
        }, INTERVAL_LONG);
    }

    if (TUTORIAL_STEP == 3) {
        tooltip('.search-filters a:nth-of-type(3)',
                'The <span class="green-text">Properties</span> tab contains all the properties of the data types that can be found in these vocabularies.',
                'right'
        );

        setTimeout(function() {
            $('.home-search .right.button.orange').attr('href', '/vocabularies/categories/all/?tutorial=true&step=4');
            tooltip('.home-search .right.button.orange',
                    'Click <span class="green-text">Browse categories</span> to find vocabularies grouped in various categories according to their domain.',
                    'left'
            );
        }, INTERVAL_LONG);
    }

    if (TUTORIAL_STEP == 4) {
        $('.category-tag:nth-of-type(15)').attr('href', $('.category-tag:nth-of-type(15)').attr('href') + '&tutorial=true&step=5');

        tooltip('.category-tag:nth-of-type(15)',
                'Click on the <span class="green-text">health</span> category to browse vocabularies about various health-related concepts.',
                'right'
        );
    }

    if (TUTORIAL_STEP == 5) {
        var selector = '.vocabulary-teaser:nth-of-type(1) h3 > a'
        $(selector).attr('href', $(selector).attr('href') + '?tutorial=true&step=6');

        tooltip('.vocabulary-teaser:nth-of-type(1)',
                '<p>Suppose you work in a health organization. Typically, you\'ll have to use information published outside of your company.<br />By re-using existing ontologies, you become able to easily connect your data with information published by other organizations like hospitals, research centers or the state.</p>' +
                'Select the <span class="green-text">Translational Medicine Ontology</span> to view more information about this ontology & learn how to use it.',
                'right'
        );
    }

    if (TUTORIAL_STEP == 6) {
        tooltip('p.description',
                'The vocabulary\'s description helps you understand what kind of needs this vocabulary solves, and what type of data you can expect using terms from this vocabulary.',
                'top'
        );

        setTimeout(function() {
            tooltip('#usage-example',
                    'A <span class="green-text">usage example</span> can serve as a basis for advanced LinDA users who want to compose RDF data or complicated queries manually.',
                    'top'
            );

            setTimeout(function() {
                window.location.href = '/vocabularies/all/?tutorial=true&step=7';
            }, INTERVAL_VERY_LONG);
        }, INTERVAL_VERY_LONG);
    }

    if (TUTORIAL_STEP == 7) {
        tooltip('.vocabulary-search-form input[type="submit"]',
                '<p>That\'s basically it!<br />Use the vocabulary repository to discover appropriate vocabularies for your business domains and you will be able to connect to public data in no time!</p>' +
                '<p><a href="/">Back to home page</a></p>',
                'right'
        );
    }