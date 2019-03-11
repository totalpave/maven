solutions = [
  {
    "url": "https://chromium.googlesource.com/chromium/src.git",
    "managed": False,
    "name": "src",
    "custom_deps": {
	  'build': None,
      'build/scripts/command_wrapper/bin': None,
      'build/scripts/gsd_generate_index': None,
      'build/scripts/private/data/reliability': None,
      'build/scripts/tools/deps2git': None,
      'build/third_party/cbuildbot_chromite': None,
      'build/third_party/gsutil': None,
      'build/third_party/lighttpd': None,
      'build/third_party/swarm_client': None,
      'build/third_party/xvfb': None,
      'build/xvfb': None,
      'commit-queue': None,
      'depot_tools': None,
      'src/chrome/tools/test/reference_build/chrome_linux': None,
      'src/chrome/tools/test/reference_build/chrome_mac': None,
      'src/chrome/tools/test/reference_build/chrome_win': None,
    },
    
    "custom_vars": {},

    'custom_hooks': [
      # Disable the hook that downloads the Google Play services library and
      # asks the user to accept its EULA if necessary. The prompt is not show
      # correctly, and we call it ourselves in DEPS.xwalk.
      {
        'name': 'sdkextras',
      },
      # Disable Chromium's "gyp" hooks, which runs the gyp_chromium script. We
      # are not interested in running it as we use gyp_xwalk instead (and it is
      # run at a later stage as a hook in Crosswalk's own DEPS).
      {
        'name': 'gyp',
      }
  },
]
target_os = ["android"]

hooks = [
  {
    'action': [
      'python',
      'src/build/util/lastchange.py',
      '--revision-id-only',
      '--source-dir',
      'src/third_party/WebKit',
      '--output',
      'src/xwalk/build/UPSTREAM.blink'
    ],
    'pattern': '.',
    'name': 'upstream_revision'
  },

  # Pull clang-format and gn binaries like Chromium itself does.
  # We need our own copy for them to be found correctly when working in
  # src/xwalk.
  {
    'action': [
      'download_from_google_storage',
      '--no_resume',
      '--platform=win32',
      '--no_auth',
      '--bucket',
      'chromium-gn',
      '-s',
      'src/xwalk/buildtools/win/gn.exe.sha1'
    ],
    'pattern':
      '.',
    'name':
      'gn_win'
  },
  {
    'action': [
      'download_from_google_storage',
      '--no_resume',
      '--platform=darwin',
      '--no_auth',
      '--bucket',
      'chromium-gn',
      '-s',
      'src/xwalk/buildtools/mac/gn.sha1'
    ],
    'pattern':
      '.',
    'name':
      'gn_mac'
  },
  {
    'action': [
      'download_from_google_storage',
      '--no_resume',
      '--platform=linux*',
      '--no_auth',
      '--bucket',
      'chromium-gn',
      '-s',
      'src/xwalk/buildtools/linux64/gn.sha1'
    ],
    'pattern':
      '.',
    'name':
      'gn_linux64'
  },
  {
    'action': [
      'download_from_google_storage',
      '--no_resume',
      '--platform=win32',
      '--no_auth',
      '--bucket',
      'chromium-clang-format',
      '-s',
      'src/xwalk/buildtools/win/clang-format.exe.sha1'
    ],
    'pattern':
      '.',
    'name':
      'clang_format_win'
  },
  {
    'action': [
      'download_from_google_storage',
      '--no_resume',
      '--platform=darwin',
      '--no_auth',
      '--bucket',
      'chromium-clang-format',
      '-s',
      'src/xwalk/buildtools/mac/clang-format.sha1'
    ],
    'pattern':
      '.',
    'name':
      'clang_format_mac'
  },
  {
    'action': [
      'download_from_google_storage',
      '--no_resume',
      '--platform=linux*',
      '--no_auth',
      '--bucket',
      'chromium-clang-format',
      '-s',
      'src/xwalk/buildtools/linux64/clang-format.sha1'
    ],
    'pattern':
      '.',
    'name':
      'clang_format_linux'
  }
]
