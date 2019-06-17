<?php	
namespace Craft;

return [
    'base' => 'api',
    'cache' => false,
    'routes' => [
        '' => function () {
            $entries = craft()
                -> elements
                -> getCriteria( ElementType::Entry, [
                    'section' => 'projects',
                    'limit' => null
                ]);
            $projects = [];
            foreach ( $entries as $entry ) {
                $projects[] = [
                    'title' => $entry -> title,
                    'slug' => $entry -> slug,
                    'thumbnail' => image( $entry -> thumbnail -> first() )
                ];
            }
            return [
                'introText' => craft()->globals->getSetByHandle('globals')->introText,
                'projects' => $projects
            ];
        },
        '/project/{slug}' => function ( $params, $query ) {
            $entry = craft()
                -> elements
                -> getCriteria( ElementType::Entry, [
                    'section' => 'projects',
                    'slug' => $params['slug'],
                    'limit' => null
                ])
                -> first();
            $element = null;
            if ( count( $entry -> element ) ) {
                $elementEntry = $entry -> element -> first();
                $sections = [];
                foreach ( $elementEntry -> sections as $section ) {
                    $sections []= [
                        'heading' => $section -> heading,
                        'body' => $section -> body ? $section -> body -> getParsedContent() : '',
                    ];
                }
                $element = [
                    'title' => $elementEntry -> title,
                    'summary' => $elementEntry -> summary,
                    'sections' => $sections,
                    'symbolDark' => asset( $elementEntry -> symbolDark -> first() ),
                    'symbolLight' => asset( $elementEntry -> symbolLight -> first() ),
                ];
            }
            return [
                'type' => 'project',
                'title' => $entry -> title,
                'slug' => $entry -> slug,
                'summary' => $entry -> summary,
                'thumbnail' => image( $entry -> thumbnail -> first() ),
                'blocks' => blocks( $entry -> blocks ),
                'url' => $entry -> getUrl(),
                'description' => $entry -> description ? $entry -> description -> getParsedContent() : '',
                'quote' => $entry -> quote ? $entry -> quote -> getParsedContent() : '',
                'attribution' => $entry -> attribution ? $entry -> attribution -> getParsedContent() : '',
                'element' => $element
            ];
        },
        '/conceptroom' => function ( $params, $query ) {
            $entries = craft()
                -> elements
                -> getCriteria( ElementType::Entry, [
                    'section' => 'conceptroom',
                    'limit' => null
                ]);
            $conceptroom = [];
            foreach ( $entries as $entry ) {
                $conceptroom[] = [
                    'title' => $entry -> title,
                    'slug' => $entry -> slug,
                    'summary' => $entry -> summary,
                    'composition' => (int) $entry -> composition -> value,
                    'thumbnails' => assets( $entry -> thumbnails )
                ];
            }
            return $conceptroom;
        },
        '/conceptroom/{slug}' => function ( $params, $query ) {
            $entry = craft()
                -> elements
                -> getCriteria( ElementType::Entry, [
                    'section' => 'conceptroom',
                    'slug' => $params['slug'],
                    'limit' => null
                ])
                -> first();
            return [
                'type' => 'conceptroom',
                'title' => $entry -> title,
                'slug' => $entry -> slug,
                'summary' => $entry -> summary,
                'composition' => (int) $entry -> composition -> value,
                'thumbnails' => assets( $entry -> thumbnails ),
                'blocks' => blocks( $entry -> blocks ),
                'description' => $entry -> description ? $entry -> description -> getParsedContent() : '',
                'quote' => $entry -> quote ? $entry -> quote -> getParsedContent() : '',
                'attribution' => $entry -> attribution ? $entry -> attribution -> getParsedContent() : ''
            ];
        },
        '/about' => function ( $params, $query ) {
            $entry = craft()
                -> elements
                -> getCriteria( ElementType::Entry, [ 'section' => 'about' ] )
                -> first();
            $people = [];
            foreach ( $entry -> people as $block ) {
                $people []= [
                    'name' => $block -> personName,
                    'bio' => $block -> bio ? $block -> bio -> getParsedContent() : ''
                ];
            }
            return [
                'video' => video( $entry -> video -> first() ),
                'body' => $entry -> body ? $entry -> body -> getParsedContent() : '',
                'people' => $people,
                'clients' => assets( $entry -> clients ),
                'quote' => $entry -> quote ? $entry -> quote -> getParsedContent() : '',
                'attribution' => $entry -> attribution ? $entry -> attribution -> getParsedContent() : '',
                'description' => $entry -> description ? $entry -> description -> getParsedContent() : ''
            ];
        },
        '/contact' => function ( $params, $query ) {
            $entry = craft()
                -> elements
                -> getCriteria( ElementType::Entry, [ 'section' => 'contact' ] )
                -> first();
            return [
                'heading' => $entry -> heading,
                'body' => $entry -> body ? $entry -> body -> getParsedContent() : '',
                'newsletterCTA' => $entry -> newsletterCta,
                'regNumber' => $entry -> regNumber
            ];
        },
        '/news/{page}' => function ( $params ) {
            $entries = craft()
                -> elements
                -> getCriteria( ElementType::Entry, [
                    'section' => 'news',
                    'offset' => $params[ 'page' ] * 4,
                    'limit' => 4,
                ]);
            $news = [];
            foreach ( $entries as $entry ) {
                $news []= [
                    'title' => $entry -> title,
                    'type' => 'news',
                    'thumbnail' => asset( $entry -> thumbnail -> first() ),
                    'body' => $entry -> body ? $entry -> body -> getParsedContent() : '',
                    'year' => $entry -> postDate -> format('Y')
                ];
            }
            return $news;
        }
    ]

];

function projects ( $entries ) {
    $projects = [];
    foreach ( $entries as $entry ) {
        $projects[] = [
            'title' => $entry -> title,
            'slug' => $entry -> slug,
            'thumbnail' => image( $entry -> thumbnail -> first() )
        ];
    }
    return $projects;
}

function project ( $entry ) {
    return [
        'type' => 'project',
        'title' => $entry -> title,
        'slug' => $entry -> slug,
        'summary' => $entry -> summary,
        'thumbnail' => image( $entry -> thumbnail -> first() ),
        'blocks' => blocks( $entry -> blocks ),
        'url' => $entry -> getUrl(),
        'description' => $entry -> description ? $entry -> description -> getParsedContent() : '',
        'quote' => $entry -> quote ? $entry -> quote -> getParsedContent() : '',
        'attribution' => $entry -> attribution ? $entry -> attribution -> getParsedContent() : '',
        'element' => count( $entry -> element ) ? $entry -> element -> first() -> slug : null
    ];
}

function blocks ( $matrix ) {
    $blocks = [];
    foreach ( $matrix as $block ) {
        $item = [
            'type' => (string) $block -> type
        ];
        switch ( $block -> type ) {
            case 'text':
                $item[ 'text' ] = $block -> text;
                break;
            case 'asset':
                $item[ 'asset' ] = asset( $block -> asset -> first() );
                $item[ 'caption' ] = $block -> caption;
                break;
            case 'twoAssets':
                $item[ 'assets' ] = assets( $block -> assets );
                $item[ 'order' ] = $block -> order -> value;
                break;
        }
        $blocks []= $item;
    }
    return $blocks;
}

function assets ( $assets ) {
    $ret = [];
    foreach ( $assets as $asset ) $ret []= asset( $asset );
    return $ret;
}

function asset ( $asset ) {
    switch ( $asset -> kind ) {
        case 'image': return image( $asset );
        case 'video': return video( $asset );
    }
}

function image ( $asset ) {
	$transforms = craft() -> assetTransforms -> allTransforms;
	$sortByWidth = function ( $transformA, $transformB ) {
        return $transformA -> width > $transformB -> width ? 1 : -1;
    };
    usort( $transforms, $sortByWidth );
    $naturalWidth = (int) $asset -> getWidth();
    $naturalHeight = (int) $asset -> getHeight();
    $srcs = [];
	foreach ( $transforms as $transform ) {
		if ( $transform -> width > $naturalWidth ) continue;
		$srcs[] = [
		    'size' => [
		        $asset -> getWidth( $transform ),
		        $asset -> getHeight( $transform )
            ],
			'url' => $asset -> getUrl( $transform )
		];
	}
	if ( count( $srcs ) < count( $transforms ) ) {
		$natural = $asset -> getUrl([
			'mode' => 'crop',
			'width' => $naturalWidth,
			'height' => $naturalHeight,
			'quality' => 75
		]);
		$srcs[] = [
		    'size' => [ $naturalWidth, $naturalHeight ],
			'url' => $natural
		];
	}
	return [
	    'type' => 'image',
	    'id' => $asset -> id,
	    'size' => [ $naturalWidth, $naturalHeight ],
	    'srcs' => $srcs
	];
}

function video ( $asset ) {
    return [
        'type' => 'video',
        'id' => $asset -> id,
        'src' => $asset -> url
    ];
}