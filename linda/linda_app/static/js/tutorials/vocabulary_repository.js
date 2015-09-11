    if (TUTORIAL_STEP == 1) {
        //introductory text
        $().ready(function() {
            tooltip('.page-title',
                    'Welcome to the LinDA Vocabulary Repository!<br />In this tutorial, you will understand <span class="green-text">how</span> to use the vocabulary repository and <span class="green-text">why</span> it\'s important to use term vocabularies for your data.',
                    'bottom'
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
            tooltip('.home-search .right.button.orange',
                    'By clicking <span class="green-text">Browse categories</span> you can find vocabularies grouped in various categories according to their domain.',
                    'left'
            );

            setTimeout(function() {
                window.location.href = '/vocabularies/categories/all/?tutorial=true&step=4';
            },   INTERVAL_VERY_LONG);
        }, INTERVAL_LONG);
    }

    if (TUTORIAL_STEP == 4) {
        $('.category-tag:nth-of-type(15)').attr('href', $('.category-tag:nth-of-type(15)').attr('href') + '&tutorial=true&step=5');

        tooltip('.category-tag:nth-of-type(15)',
                'Click on the <span class="green-text">health</span> category to browse vocabularies about various health-related concepts.',
                'right'
        );
    }