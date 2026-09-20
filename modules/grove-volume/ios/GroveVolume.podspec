Pod::Spec.new do |s|
  s.name = 'GroveVolume'
  s.version = '1.0.0'
  s.summary = 'Read media output volume for Word Grove pronunciation hints'
  s.description = s.summary
  s.license = { :type => 'MIT' }
  s.author = 'Word Grove'
  s.homepage = 'https://expo.dev'
  s.source = { :git => 'https://github.com/expo/expo.git' }
  s.platforms = { :ios => '16.4' }
  s.swift_version = '5.9'
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.{h,m,swift}'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
end
