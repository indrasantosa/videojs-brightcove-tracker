var howLongUntilLunch = (function (videojs) {
  'use strict';

  videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

  var version = "0.0.1";

  // Cross-compatibility for Video.js 5 and 6.
  const registerPlugin = videojs.registerPlugin || videojs.plugin;
  const dom = videojs.dom || videojs;

  const EVENTS = [
    'loadstart',
    'progress',
    'suspend',
    'abort',
    'error',
    'emptied',
    'stalled',
    'loadedmetadata',
    'loadeddata',
    'canplay',
    'canplaythrough',
    'playing',
    'waiting',
    'seeking',
    'seeked',
    'ended',
    'durationchange',
    'timeupdate',
    'play',
    'pause',
    'ratechange',
    'resize',
    'volumechange'
  ];

  const trackingUrlSample =
    'http://metrics.brightcove.com/tracker?event=video_view&session=581136_2018-07-03T18:34:46.214Z&destination=http%3A%2F%2Fwww.current-times.com%2F&video=2621468623001&video_name=Debate-2&video_duration=189&time=1377191666432&source=http%3A%2F%2Fwww.google.com%2Furl%252F%26ei%3DoEYWUtCgEIXq9ATznoCgCQ%26us-g%3DAFQjCNEtv.51156542%2Cd.dmg&domain=videocloud&account=1749339200';

  const onPlayerLoadedMetaData = e => player => {
    const el = dom.createEl('img', {
      className: 'vcs-bctr'
    });
    el.src = trackingUrlSample;
    player.el().appendChild(el);
  };

  function brightcoveTracker(options) {
    EVENTS.map(event => {
      this.on(event, function(e) {
        console.log(`Event ${event} is triggered`);
      });

      this.on('loadedmetadata', function(e) {
        onPlayerLoadedMetaData()(this);
      });
    });
  }

  registerPlugin('brightcoveTracker', brightcoveTracker);

  brightcoveTracker.version = version;

  return brightcoveTracker;

}(videojs));
