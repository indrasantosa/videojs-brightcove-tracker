import videojs from'video.js';var version = "0.0.4";// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
const dom = videojs.dom || videojs;
let startTime, endTime;

class BrightcoveTracker {
  constructor({
    player,
    session,
    destination,
    video,
    videoName,
    videoDuration,
    source,
    domain,
    account,
    startTimeMs
  }) {
    const self = this;
    this.player = player;

    this.session = session;
    this.destination = destination;
    this.video = video;
    this.videoName = videoName;
    this.videoDuration = videoDuration;
    this.source = source;
    this.domain = domain;
    this.account = account;
    this.startTimeMs = startTimeMs;

    this.sendTracking = this.sendTracking.bind(this);

    this.player.on('loadstart', function(e) {
      startTime = Date.now();
    });

    this.player.on('loadedmetadata', function(e) {
      endTime = Date.now();
      self.startTimeMs = endTime - startTime;
      self.videoDuration = self.player.duration();
      self.sendTracking();
    });
  }

  setVideoTracker({
    session = this.session,
    destination = this.destination,
    video = this.video,
    videoName = this.videoName,
    videoDuration = this.videoDuration,
    source = this.source,
    domain = this.domain,
    account = this.account,
    startTimeMs = this.startTimeMs
  }) {
    this.session = session;
    this.destination = destination;
    this.video = video;
    this.videoName = videoName;
    this.videoDuration = videoDuration;
    this.source = source;
    this.domain = domain;
    this.account = account;
    this.startTimeMs = startTimeMs;
  }

  sendTracking() {
    /**
     * Based on best practice, we need to send analytics by creating an
     * image with source the tracking url. Pretty much
     * ref: https://support.brightcove.com/overview-data-collection-api-v2
     */
    const trackingSource = `https://metrics.brightcove.com/tracker?event=video_view&session=${
      this.session
    }&destination=${this.destination}&video=${this.video}&video_name=${
      this.videoName
    }&video_duration=${this.videoDuration}&time=${Date.now()}&source=${
      this.source
    }&domain=${this.domain}&account=${this.account}&start_time_ms=${
      this.startTimeMs
    }`;
    const el = dom.createEl('img', {
      className: 'vcs-bctr'
    });
    el.src = trackingSource;
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

brightcoveTracker.version = version;export default brightcoveTracker;