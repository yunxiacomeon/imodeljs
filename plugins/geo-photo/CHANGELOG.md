# Change Log - @bentley/geo-photo-plugin

This log was last generated on Tue, 10 Dec 2019 18:08:56 GMT and should not be manually modified.

## 1.9.0
Tue, 10 Dec 2019 18:08:56 GMT

### Updates

- Fix bug finding close neighbors when changing displayed folders
- Bug in finding close neighbors. Track added to tool tip
- Disallow plugins from adding tools anywhere but the end of a toolbar.
- No longer accessing this.state or this.props in setState updater - flagged by lgtm report

## 1.8.0
Fri, 22 Nov 2019 14:03:34 GMT

### Updates

- Added user interface to show progress and allow selection of folders.

## 1.7.0
Fri, 01 Nov 2019 13:28:37 GMT

### Updates

- Fixes and improvements to reading image tags. 
- Fix for tooltip and z position
- Optimize conversion of photo geoLocations to spatial coordinates
- Use internal pannellum viewer on ctrl-click. Change color of visited panos.

## 1.6.0
Wed, 09 Oct 2019 20:28:42 GMT

### Updates

- Added licensing notice. 
- Initial publish of the Geo-Photo Plugin
- Refactored geoPhoto plugins to allow for tests in chrome and node.js

