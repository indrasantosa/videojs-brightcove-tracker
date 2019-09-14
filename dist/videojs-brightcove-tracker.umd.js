var howLongUntilLunch = (function (videojs) {
  'use strict';

  videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

  var version = "0.0.1";

  const trackingUrlSample =
    'http://metrics.brightcove.com/tracker?event=video_view&session=581136_2018-07-03T18:34:46.214Z&destination=http%3A%2F%2Fwww.current-times.com%2F&video=2621468623001&video_name=Debate-2&video_duration=189&time=1377191666432&source=http%3A%2F%2Fwww.google.com%2Furl%252F%26ei%3DoEYWUtCgEIXq9ATznoCgCQ%26us-g%3DAFQjCNEtv.51156542%2Cd.dmg&domain=videocloud&account=1749339200';

  // Cross-compatibility for Video.js 5 and 6.
  const registerPlugin = videojs.registerPlugin || videojs.plugin;
  const dom = videojs.dom || videojs;

  class BrightcoveTracker {
    constructor({
      player,
      session,
      destination,
      video,
      videoName,
      videoDuration,
      time,
      source,
      domain,
      account
    }) {
      const self = this;
      this.player = player;

      this.session = session;
      this.destination = destination;
      this.video = video;
      this.videoName = videoName;
      this.videoDuration = videoDuration;
      this.time = time;
      this.source = source;
      this.domain = domain;
      this.account = account;

      this.sendTracking = this.sendTracking.bind(this);

      this.player.on('loadedmetadata', function(e) {
        self.sendTracking();
      });
    }

    setVideoTracker({
      session = this.session,
      destination = this.destination,
      video = this.video,
      videoName = this.videoName,
      videoDuration = this.videoDuration,
      time = this.time,
      source = this.source,
      domain = this.domain,
      account = this.account
    }) {
      this.session = session;
      this.destination = destination;
      this.video = video;
      this.videoName = videoName;
      this.videoDuration = videoDuration;
      this.time = time;
      this.source = source;
      this.domain = domain;
      this.account = account;
    }

    sendTracking() {
      /**
       * Based on best practice, we need to send analytics by creating an
       * image with source the tracking url. Pretty much
       * ref: https://support.brightcove.com/overview-data-collection-api-v2
       */
      const el = dom.createEl('img', {
        className: 'vcs-bctr'
      });
      el.src = trackingUrlSample;
      this.player.el().appendChild(el);
    }
  }

  function brightcoveTracker(options) {
    this.ready(() => {
      this.bcTracker = new BrightcoveTracker({
        ...options,
        player: this
      });
    });
  }

  registerPlugin('brightcoveTracker', brightcoveTracker);

  brightcoveTracker.version = version;

  return brightcoveTracker;

}(videojs));
