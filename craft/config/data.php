<?php	
namespace Craft;

ini_set('max_execution_time', 300);

return [
    'all' => function () {
        
        $projects = craft()
            -> elements
            -> getCriteria( ElementType::Entry, [ 'section' => 'projects', 'limit' => null ] );
        
        $conceptroom = craft()
            -> elements
            -> getCriteria( ElementType::Entry, [ 'section' => 'conceptroom' ] )
            -> first();
            
        $conceptroomEntries = craft()
            -> elements
            -> getCriteria( ElementType::Entry, [ 'section' => 'conceptroomEntries', 'limit' => null ] );
        
        $about = craft()
            -> elements
            -> getCriteria( ElementType::Entry, [ 'section' => 'about' ] )
            -> first();
            
        $contact = craft()
            -> elements
            -> getCriteria( ElementType::Entry, [ 'section' => 'contact' ] )
            -> first();
            
        $news = craft()
            -> elements
            -> getCriteria( ElementType::Entry, [ 'section' => 'news', 'limit' => null ] );

        $elements = craft()
            -> elements
            -> getCriteria( ElementType::Entry, [ 'section' => 'elements', 'limit' => null ] );
        
        return [
            'introText' => craft()->globals->getSetByHandle('globals')->introText,
            'projects' => projects( $projects ),
            'conceptroom' => conceptroom( $conceptroom, $conceptroomEntries ),
            'about' => about( $about ),
            'news' => news( $news ),
            'contact' => contact( $contact ),
            'elements' => elements( $elements )
        ];
        
    }
];

function projects ( $entries ) {
    $projects = [];
    foreach ( $entries as $entry ) {
        $projects[] = project( $entry );
    }
    return $projects;
}

function project ( $entry ) {
    return [
        'type' => 'project',
        'title' => $entry -> title,
        'slug' => $entry -> slug,
        'summary' => $entry -> summary,
        'thumbnail' => asset( $entry -> thumbnail -> first() ),
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

function conceptroom ( $single, $entries ) {
    $conceptroom = [];
    foreach ( $entries as $entry ) {
        $conceptroom []= [
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
    }
    return [
        'introText' => $single -> introText,
        'entries' => $conceptroom
    ];
}

function about ( $entry ) {
    $people = [];
    foreach ( $entry -> people as $block ) {
        $people []= [
            'name' => $block -> personName,
            'bio' => $block -> bio ? $block -> bio -> getParsedContent() : ''
        ];
    }
    return [
        'type' => 'about',
        'video' => video( $entry -> video -> first() ),
        'body' => $entry -> body ? $entry -> body -> getParsedContent() : '',
        'people' => $people,
        'clients' => assets( $entry -> clients ),
        'quote' => $entry -> quote ? $entry -> quote -> getParsedContent() : '',
        'attribution' => $entry -> attribution ? $entry -> attribution -> getParsedContent() : '',
        'description' => $entry -> description ? $entry -> description -> getParsedContent() : ''
    ];
}

function news ( $entries ) {
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

function elements ( $entries ) {
    $elements = [];
    foreach ( $entries as $entry ) {
        $sections = [];
        foreach ( $entry -> sections as $section ) {
            $sections []= [
                'heading' => $section -> heading,
                'body' => $section -> body ? $section -> body -> getParsedContent() : '',
            ];
        }
        $elements []= [
            'title' => $entry -> title,
            'slug' => $entry -> slug,
            'summary' => $entry -> summary,
            'sections' => $sections,
            'symbolDarkFilled' => asset( $entry -> symbolDarkFilled -> first() ),
            'symbolDarkOutlined' => asset( $entry -> symbolDarkOutlined -> first() ),
            'symbolLightFilled' => asset( $entry -> symbolLightFilled -> first() ),
            'symbolLightOutlined' => asset( $entry -> symbolLightOutlined -> first() ),
        ];
    }
    return $elements;
}

function contact ( $entry ) {
    return [
        'type' => 'contact',
        'heading' => $entry -> heading,
        'body' => $entry -> body ? $entry -> body -> getParsedContent() : '',
        'newsletterCTA' => $entry -> newsletterCta,
        'regNumber' => $entry -> regNumber,
        'privacyPolicy' => count( $entry -> privacyPolicy ) > 0 ? $entry -> privacyPolicy -> first() -> getUrl() : null
    ];
}

function assets ( $assets ) {
    $ret = [];
    foreach ( $assets as $asset ) $ret []= asset( $asset );
    return $ret;
}

function asset ( $asset ) {
    if ( $asset == null ) return null;
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
    require_once( __DIR__ . '/resources/getid3/getid3.php' );
    $getID3 = new \getID3;
    $file = $getID3 -> analyze( $_SERVER['DOCUMENT_ROOT'] . $asset -> url );
    return [
        'type' => 'video',
        'id' => $asset -> id,
        'size' => [ $file['video']['resolution_x'], $file['video']['resolution_y'] ],
        'src' => $asset -> url
    ];
}