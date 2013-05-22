<?php
/* -----------------  custom post types  ------------------- */


add_action( 'init', 'create_post_types' );

function create_post_types() {
	register_post_type( 'play',
		array(
			'labels' => array(
				'name' => __( 'Plays' ),
				'singular_name' => __( 'Play' ),
				'add_new_item' => _x('Add new play', 'play'),
				'edit_item' => _x('Edit play', 'play'),
			),
		'public' => true,
		'hierarchical' => true,
		'has_archive' => true,
		'rewrite' => array('slug' => 'plays'),
		'supports' => array( 'title', 'page-attributes' ),
		'menu_position' => 5
		)
	);
	
	register_post_type( 'press',
		array(
			'labels' => array(
				'name' => __( 'Press' ),
				'singular_name' => __( 'Press Quote' ),
				'add_new_item' => _x('Add new press quote', 'press'),
				'edit_item' => _x('Edit press quote', 'press'),
			),
		'public' => true,
		'hierarchical' => true,
		'has_archive' => true,
		'rewrite' => array('slug' => 'press'),
		'supports' => array( 'title', 'page-attributes' ),
		'menu_position' => 5
		)
	);
}

add_theme_support( 'post-thumbnails' );

/* --------------------------------------------------------- */


/* -----------------  custom taxonomies  ------------------- */


add_action( 'init', 'spawn_taxonomies' );

function spawn_taxonomies() {
	register_taxonomy(
		'parent_plays',
		'press',
		array(
			'label' => __( 'Play(s) referenced' ),
			'rewrite' => array( 'slug' => 'parent_plays' )
		)
	);
}


/* --------------------------------------------------------- */

?>
