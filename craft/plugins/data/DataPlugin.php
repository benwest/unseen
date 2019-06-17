<?php
namespace Craft;

class DataPlugin extends BasePlugin
{
	public function getName(){
		return Craft::t('Data');
	}
	public function getVersion(){
		return '1.0';
	}
	public function getDeveloper(){
		return 'BONG';
	}
	public function getDeveloperUrl(){
		return 'http://bong.international';
	}
	public function addTwigExtension () {
        Craft::import('plugins.data.twigextensions.DataTwigExtension');
        return new DataTwigExtension();
    }
}
