<?php
namespace Craft;

class ApiPlugin extends BasePlugin
{
	public function getName()
	{
		return Craft::t('API');
	}

	public function getVersion()
	{
		return '1.0';
	}

	public function getDeveloper()
	{
		return 'BONG';
	}

	public function getDeveloperUrl()
	{
		return 'http://bong.international';
	}
	
	public function init()  
	{
		
		$flush = function ( Event $event ) {
			
			craft() -> cache -> flush();
			
		};
		
		craft () -> on( 'entries.saveEntry', $flush );
		craft () -> on( 'entries.deleteEntry', $flush );
		craft () -> on( 'assets.saveAsset', $flush );
		craft () -> on( 'assets.deleteAsset', $flush );
		craft () -> on( 'globals.saveGlobalContent', $flush );
	
	}

	public function registerSiteRoutes()
	{
		
		$base = craft() -> config -> get( 'base', 'api' );
		
		$handlers = craft() -> config -> get( 'routes', 'api' );
		
		$routes = [];
		
		foreach ( $handlers as $url => $handler ) {
			
			$url = preg_replace( '/{(.*?)}/', '(?P<$1>[^\/]+)', $url );
			
			$routes[ $base . $url ] = [
				
				'action' => 'Api/request',
				
				'params' => [
					'handler' => $handler
				]
				
			];
			
		}
		
		return $routes;
		
	}
}
