<?php

namespace Craft;

use Twig_Extension;
use Twig_Function_Method;

class DataTwigExtension extends \Twig_Extension {
    public function getFunctions () {
        return [
            'data' => new \Twig_Function_Method( $this, 'data' )
        ];
    }
    public function data ( $key ) {
        $value = craft() -> config -> get( $key, 'data' );
        if ( is_callable( $value ) ) {
            $args = [];
            for($i = 1 ; $i < func_num_args(); $i++) {
                $args[] = func_get_arg($i);
            }
            return call_user_func_array( $value, $args );
        } else {
            return $value;
        }
    }
}