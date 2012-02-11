<?php

		$modules = glob("./../modules/*.mod");
		foreach($modules as $module){
			if ((include $module) === false) {
				//$this->log->error("{$module} module could not be loaded", "core", "modules_load");
				continue;
			}

			$bn = basename($module, ".mod");
			$info = call_user_func(array($bn, 'info'));

			foreach ($info['hooks'] as $hook => $function) {
				//$this->
				register_hook($hook, array($bn, $function));
			}

			//$this->modules[$bn] = new $bn;

			//$this->modules_info[$bn] = $info;
		}
	
		function register_hooks ($hook, $call) {
			

