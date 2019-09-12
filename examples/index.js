/**
 * Copyright 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const SAMPLE_TAG =
  'http://pubads.g.doubleclick.net/gampad/ads?' +
  'sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&' +
  'ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&' +
  'unviewed_position_start=1&' +
  'cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&' +
  'vid=short_onecue&correlator=';

const SPOTX_AD_TAG =
  'https://search.spotxchange.com/vast/2.00/85394?VPAID=js&content_page_url=http%3A%2F%2Fmygame.foo.com&site[cat]=IAB6-8&device[dnt]=0&ip_addr=165.23.234.23&device[ua]=Mozilla%2F5.0%20(Linux%3B%20Android%204.2.1%3B%20Nexus%207%20Build%2FJOP40D)%20AppleWebKit%2F535.19%20(KHTML%2C%20like%20Gecko)%20Chrome%2F18.0.1025.166%20%20Safari%2F535.19&device[geo][lat]=39.8967&device[geo][lon]=-105.0738&cb=89794168512';

var Ads = function() {
  // Set up UI stuff.
  this.adTagInput = document.getElementById('tagInput');
  var sampleAdTag = document.getElementById('sampleAdTag');
  sampleAdTag.addEventListener('click', () => {
    this.adTagInput.value = SAMPLE_TAG;
  });
  this.console = document.getElementById('ima-sample-console');

  this.player = videojs('content_video', {
    plugins: {
      brightcoveTracker: {}
    }
  });
  if (this.player.ads) {
    this.player.ima({
      // adTagUrl: SPOTX_AD_TAG,
      // autoPlayAdBreaks: false,
      forceNonLinearFullSlot: true,
      vastLoadTimeout: 5000,
      timeout: 5000,
      contribAdsSettings: {
        timeout: 5000
      },
      adsManagerLoadedCallback: () => {
        const self = this;
        this.player.ima.addEventListener(
          google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
          () => {
            self.player.play();
          }
        );
        var events = [
          google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
          google.ima.AdEvent.Type.CLICK,
          google.ima.AdEvent.Type.COMPLETE,
          google.ima.AdEvent.Type.FIRST_QUARTILE,
          google.ima.AdEvent.Type.LOADED,
          google.ima.AdEvent.Type.MIDPOINT,
          google.ima.AdEvent.Type.PAUSED,
          google.ima.AdEvent.Type.RESUMED,
          google.ima.AdEvent.Type.STARTED,
          google.ima.AdEvent.Type.THIRD_QUARTILE
        ];

        for (var index = 0; index < events.length; index++) {
          this.player.ima.addEventListener(
            events[index],
            console.log(events[index])
          );
        }

        this.player.on('adslog', this.onAdLog.bind(this));
      }
    });
  }

  const initPrerollDisplay = () => {
    if (this.player.ads) {
      this.player.pause();
      this.player.ima.initializeAdDisplayContainer();
      this.player.ima.setContentWithAdTag(null, SPOTX_AD_TAG);
      this.player.ima.requestAds();
    }
  };

  let self = this;

  this.player.on('loadedmetadata', function() {
    var promise = self.player.play();
    console.log('promise', promise);
    if (promise !== undefined) {
      promise
        .then(function() {
          initPrerollDisplay();
        })
        .catch(function(error) {
          // Autoplay was prevented.
          // // +++ If autoplay prevented mute the video, play video and display unmute button +++
          self.player.muted(true);
          initPrerollDisplay();

          // setTimeout(function() {
          //   myPlayer.muted(false);
          //   myPlayer.volume(volumeLevel);
          // }, 3000)
        });
    }
  });
};

Ads.prototype.adsManagerLoadedCallback = function() {
  var events = [
    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
    google.ima.AdEvent.Type.CLICK,
    google.ima.AdEvent.Type.COMPLETE,
    google.ima.AdEvent.Type.FIRST_QUARTILE,
    google.ima.AdEvent.Type.LOADED,
    google.ima.AdEvent.Type.MIDPOINT,
    google.ima.AdEvent.Type.PAUSED,
    google.ima.AdEvent.Type.RESUMED,
    google.ima.AdEvent.Type.STARTED,
    google.ima.AdEvent.Type.THIRD_QUARTILE
  ];

  for (var index = 0; index < events.length; index++) {
    this.player.ima.addEventListener(events[index], this.onAdEvent.bind(this));
  }

  this.player.on('adslog', this.onAdLog.bind(this));
};

Ads.prototype.onAdLog = function(data) {
  this.log('Ad log: ' + data.data.AdError);
};

Ads.prototype.onAdEvent = function(event) {
  var message = 'Ad event: ' + event.type;
  this.log(message);
};

Ads.prototype.log = function(message) {
  this.console.innerHTML = this.console.innerHTML + '<br/>' + message;
};
