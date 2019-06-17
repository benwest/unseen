<?php
namespace Craft;

class ApiController extends BaseController {
	
	protected $allowAnonymous = true;
	
	public function actionRequest ( $handler, array $variables = array() ) {
		
		$cacheEnabled = craft() -> config -> get('cache', 'api');
		
		$cacheKey = craft() -> request -> url;
		
		$cached = craft() -> cache -> get( $cacheKey );
		
		JsonHelper::sendJsonHeaders();
		
		HeaderHelper::setHeader( ['Access-Control-Allow-Origin: *'] );
		
		if ( $cacheEnabled && $cached ) {
			
			echo $cached;
			
		} else {
			
			$query = craft() -> request -> getQuery();
			
			$response = json_encode( $handler( $variables, $query ) );
					
			if ( $cacheEnabled ) craft() -> cache -> set( $cacheKey, $response );
			
			echo $response;
			
		}
		
		craft() -> end();
		
	}
	
}
