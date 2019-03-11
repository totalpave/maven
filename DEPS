vars = {

# REPOS

	'chromium_git': 'https://chromium.googlesource.com',
	'xwalk_git': 'https://github.com/totalpave'

# REVISIONS

	
	'chromium_rev': '72.0.3626.121',
	'buildtools_rev': '454e53abae6e4d68ee992b0a93a4174b75519393',
	'crosswalk_rev': 'totalpave/master',
	'libpxc_rev': '568e4ecc969b4663e82034e71d08efdd5fa77e1a'
}

deps = {
	'src/' : Var('chromium_git') + '/chromium/src.git' + '@' + Var('chromium_rev'),
	'src/third_party/libpxc': Var('xwalk_git') + '/libpxc.git@' + Var('libpxc_rev'),
	'src'/xwalk/': Var('xwalk_git') + '/crosswalk.git@' + Var('crosswalk_rev'),
	'src/xwalk/buildtools': Var('chromium_git') + '/chromium/buildtools.git@' + Var('buildtools_rev')
}
