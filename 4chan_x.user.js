// ==UserScript==
// @name         4chan X alpha
// @version      3.0.0
// @description  Adds various features.
// @copyright    2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright    2012 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license      MIT; http://en.wikipedia.org/wiki/Mit_license
// @match        *://boards.4chan.org/*
// @match        *://images.4chan.org/*
// @match        *://sys.4chan.org/*
// @run-at       document-start
// @updateURL    https://github.com/MayhemYDG/4chan-x/raw/stable/4chan_x.user.js
// @downloadURL  https://github.com/MayhemYDG/4chan-x/raw/stable/4chan_x.user.js
// @icon         http://mayhemydg.github.com/4chan-x/favicon.gif
// ==/UserScript==

/* LICENSE
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
 * http://mayhemydg.github.com/4chan-x/
 * 4chan X 3.0.0
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * HACKING
 *
 * 4chan X is written in CoffeeScript[1], and developed on GitHub[2].
 *
 * [1]: http://coffeescript.org/
 * [2]: https://github.com/MayhemYDG/4chan-x
 *
 * CONTRIBUTORS
 *
 * noface - unique ID fixes
 * desuwa - Firefox filename upload fix
 * seaweed - bottom padding for image hover
 * e000 - cooldown sanity check
 * ahodesuka - scroll back when unexpanding images, file info formatting
 * Shou- - pentadactyl fixes
 * ferongr - new favicons
 * xat- - new favicons
 * Zixaphir - fix qr textarea - captcha-image gap
 * Ongpot - sfw favicon
 * thisisanon - nsfw + 404 favicons
 * Anonymous - empty favicon
 * Seiba - chrome quick reply focusing
 * herpaderpderp - recaptcha fixes
 * WakiMiko - recaptcha tab order http://userscripts.org/scripts/show/82657
 * btmcsweeney - allow users to specify text for sauce links
 *
 * All the people who've taken the time to write bug reports.
 *
 * Thank you.
 */

(function() {
  var $, $$, Board, Clone, Conf, Config, Get, Main, Post, QuoteBacklink, QuoteInline, QuotePreview, Quotify, Redirect, Thread, Time, UI, d, g,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Config = {
    main: {
      Enhancing: {
        '404 Redirect': [true, 'Redirect dead threads and images.'],
        'Keybinds': [true, 'Bind actions to keyboard shortcuts.'],
        'Time Formatting': [true, 'Localize and format timestamps arbitrarily.'],
        'File Info Formatting': [true, 'Reformat the file information.'],
        'Comment Expansion': [true, 'Can expand too long comments.'],
        'Thread Expansion': [true, 'Can expand threads to view all replies.'],
        'Index Navigation': [false, 'Navigate to previous / next thread.'],
        'Reply Navigation': [false, 'Navigate to top / bottom of thread.'],
        'Check for Updates': [true, 'Check for updated versions of 4chan X.']
      },
      Filtering: {
        'Anonymize': [false, 'Turn everyone Anonymous.'],
        'Filter': [true, 'Self-moderation placebo.'],
        'Recursive Filtering': [true, 'Filter replies of filtered posts, recursively.'],
        'Reply Hiding': [true, 'Hide single replies.'],
        'Thread Hiding': [true, 'Hide entire threads.'],
        'Stubs': [true, 'Make stubs of hidden threads / replies.']
      },
      Imaging: {
        'Image Auto-Gif': [false, 'Animate GIF thumbnails.'],
        'Image Expansion': [true, 'Expand images.'],
        'Expand From Position': [true, 'Expand all images only from current position to thread end.'],
        'Image Hover': [false, 'Show full image on mouseover.'],
        'Sauce': [true, 'Add sauce links to images.'],
        'Reveal Spoilers': [false, 'Reveal spoiler thumbnails.']
      },
      Menu: {
        'Menu': [true, 'Add a drop-down menu in posts.'],
        'Report Link': [true, 'Add a report link to the menu.'],
        'Delete Link': [true, 'Add post and image deletion links to the menu.'],
        'Download Link': [true, 'Add a download with original filename link to the menu. Chrome-only currently.'],
        'Archive Link': [true, 'Add an archive link to the menu.']
      },
      Monitoring: {
        'Thread Updater': [true, 'Fetch and insert new replies. Has more options in its own dialog.'],
        'Unread Count': [true, 'Show the unread posts count in the tab title.'],
        'Unread Favicon': [true, 'Show a different favicon when there are unread posts.'],
        'Post in Title': [true, 'Show the thread\'s subject in the tab title.'],
        'Thread Stats': [true, 'Display reply and image count.'],
        'Thread Watcher': [true, 'Bookmark threads.'],
        'Auto Watch': [true, 'Automatically watch threads that you start.'],
        'Auto Watch Reply': [false, 'Automatically watch threads that you reply to.']
      },
      Posting: {
        'Quick Reply': [true, 'WMD.'],
        'Persistent QR': [false, 'The Quick reply won\'t disappear after posting.'],
        'Auto Hide QR': [false, 'Automatically hide the quick reply when posting.'],
        'Open Reply in New Tab': [false, 'Open replies posted from the board pages in a new tab.'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Hide Original Post Form': [true, 'Replace the normal post form with a shortcut to open the QR.']
      },
      Quoting: {
        'Quote Backlinks': [true, 'Add quote backlinks.'],
        'OP Backlinks': [false, 'Add backlinks to the OP.'],
        'Quote Inline': [true, 'Inline quoted post on click.'],
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks.'],
        'Quote Preview': [true, 'Show quoted post on hover.'],
        'Quote Highlighting': [true, 'Highlight the previewed post.'],
        'Resurrect Quotes': [true, 'Linkify dead quotes to archives.'],
        'Indicate OP quote': [true, 'Add \'(OP)\' to OP quotes.'],
        'Indicate Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes.']
      }
    },
    filter: {
      name: ['# Filter any namefags:', '#/^(?!Anonymous$)/'].join('\n'),
      uniqueid: ['# Filter a specific ID:', '#/Txhvk1Tl/'].join('\n'),
      tripcode: ['# Filter any tripfags', '#/^!/'].join('\n'),
      capcode: ['# Set a custom class for mods:', '#/Mod$/;highlight:mod;op:yes', '# Set a custom class for moot:', '#/Admin$/;highlight:moot;op:yes'].join('\n'),
      email: ['# Filter any e-mails that are not `sage` on /a/ and /jp/:', '#/^(?!sage$)/;boards:a,jp'].join('\n'),
      subject: ['# Filter Generals on /v/:', '#/general/i;boards:v;op:only'].join('\n'),
      comment: ['# Filter Stallman copypasta on /g/:', '#/what you\'re refer+ing to as linux/i;boards:g'].join('\n'),
      flag: [''].join('\n'),
      filename: [''].join('\n'),
      dimensions: ['# Highlight potential wallpapers:', '#/1920x1080/;op:yes;highlight;top:no;boards:w,wg'].join('\n'),
      filesize: [''].join('\n'),
      md5: [''].join('\n')
    },
    sauces: ['http://iqdb.org/?url=$1', 'http://www.google.com/searchbyimage?image_url=$1', '#http://tineye.com/search?url=$1', '#http://saucenao.com/search.php?db=999&url=$1', '#http://3d.iqdb.org/?url=$1', '#http://regex.info/exif.cgi?imgurl=$2', '# uploaders:', '#http://imgur.com/upload?url=$2;text:Upload to imgur', '#http://omploader.org/upload?url1=$2;text:Upload to omploader', '# "View Same" in archives:', '#http://archive.foolz.us/search/image/$3/;text:View same on foolz', '#http://archive.foolz.us/$4/search/image/$3/;text:View same on foolz /$4/', '#https://archive.installgentoo.net/$4/image/$3;text:View same on installgentoo /$4/'].join('\n'),
    time: '%m/%d/%y(%a)%H:%M',
    backlink: '>>%id',
    fileInfo: '%l (%p%s, %r)',
    favicon: 'ferongr',
    hotkeys: {
      'open QR': ['q', 'Open QR with post number inserted.'],
      'open empty QR': ['Q', 'Open QR without post number inserted.'],
      'open options': ['alt+o', 'Open Options.'],
      'close': ['Esc', 'Close Options or QR.'],
      'spoiler tags': ['ctrl+s', 'Insert spoiler tags.'],
      'code tags': ['alt+c', 'Insert code tags.'],
      'submit QR': ['alt+s', 'Submit post.'],
      'watch': ['w', 'Watch thread.'],
      'update': ['u', 'Update the thread now.'],
      'read thread': ['r', 'Mark thread as read.'],
      'expand image': ['E', 'Expand selected image.'],
      'expand images': ['e', 'Expand all images.'],
      'front page': ['0', 'Jump to page 0.'],
      'next page': ['Right', 'Jump to the next page.'],
      'previous page': ['Left', 'Jump to the previous page.'],
      'next thread': ['Down', 'See next thread.'],
      'previous thread': ['Up', 'See previous thread.'],
      'expand thread': ['ctrl+e', 'Expand thread.'],
      'open thread': ['o', 'Open thread in current tab.'],
      'open thread tab': ['O', 'Open thread in new tab.'],
      'next reply': ['j', 'Select next reply.'],
      'previous reply': ['k', 'Select previous reply.'],
      'hide': ['x', 'Hide thread.']
    },
    updater: {
      checkbox: {
        'Auto Scroll': [false, 'Scroll updated posts into view. Only enabled at bottom of page.'],
        'Scroll BG': [false, 'Auto-scroll background tabs.'],
        'Auto Update': [true, 'Automatically fetch new posts.']
      },
      'Interval': 30
    },
    imageFit: 'fit width'
  };

  if (!/^(boards|images|sys)\.4chan\.org$/.test(location.hostname)) {
    return;
  }

  Conf = {};

  d = document;

  g = {
    VERSION: '3.0.0',
    NAMESPACE: '4chan_X.',
    boards: {},
    threads: {},
    posts: {}
  };

  UI = {
    dialog: function(id, position, html) {
      var el;
      el = d.createElement('div');
      el.className = 'reply dialog';
      el.innerHTML = html;
      el.id = id;
      el.style.cssText = localStorage.getItem("" + g.NAMESPACE + id + ".position") || position;
      el.querySelector('.move').addEventListener('mousedown', UI.dragstart, false);
      return el;
    },
    dragstart: function(e) {
      var el, rect;
      e.preventDefault();
      UI.el = el = this.parentNode;
      d.addEventListener('mousemove', UI.drag, false);
      d.addEventListener('mouseup', UI.dragend, false);
      rect = el.getBoundingClientRect();
      UI.dx = e.clientX - rect.left;
      UI.dy = e.clientY - rect.top;
      UI.width = d.documentElement.clientWidth - rect.width;
      return UI.height = d.documentElement.clientHeight - rect.height;
    },
    drag: function(e) {
      var left, style, top;
      left = e.clientX - UI.dx;
      top = e.clientY - UI.dy;
      left = left < 10 ? '0px' : UI.width - left < 10 ? null : left + 'px';
      top = top < 10 ? '0px' : UI.height - top < 10 ? null : top + 'px';
      style = UI.el.style;
      style.left = left;
      style.top = top;
      style.right = left ? null : '0px';
      return style.bottom = top ? null : '0px';
    },
    dragend: function() {
      localStorage.setItem("" + g.NAMESPACE + UI.el.id + ".position", UI.el.style.cssText);
      d.removeEventListener('mousemove', UI.drag, false);
      d.removeEventListener('mouseup', UI.dragend, false);
      return delete UI.el;
    },
    hover: function(e) {
      var clientHeight, clientWidth, clientX, clientY, height, style, top, _ref;
      clientX = e.clientX, clientY = e.clientY;
      style = UI.el.style;
      _ref = d.documentElement, clientHeight = _ref.clientHeight, clientWidth = _ref.clientWidth;
      height = UI.el.offsetHeight;
      top = clientY - 120;
      style.top = clientHeight <= height || top <= 0 ? '0px' : top + height >= clientHeight ? clientHeight - height + 'px' : top + 'px';
      if (clientX <= clientWidth - 400) {
        style.left = clientX + 45 + 'px';
        return style.right = null;
      } else {
        style.left = null;
        return style.right = clientWidth - clientX + 45 + 'px';
      }
    },
    hoverend: function() {
      $.rm(UI.el);
      return delete UI.el;
    }
  };

  /*
  loosely follows the jquery api:
  http://api.jquery.com/
  not chainable
  */


  $ = function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return root.querySelector(selector);
  };

  $$ = function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  };

  $.extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
  };

  $.extend($, {
    SECOND: 1000,
    MINUTE: 1000 * 60,
    HOUR: 1000 * 60 * 60,
    DAY: 1000 * 60 * 60 * 24,
    log: console.log.bind(console),
    engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase(),
    id: function(id) {
      return d.getElementById(id);
    },
    ready: function(fc) {
      var cb;
      if (/interactive|complete/.test(d.readyState)) {
        $.queueTask(fc);
        return;
      }
      cb = function() {
        $.off(d, 'DOMContentLoaded', cb);
        return fc();
      };
      return $.on(d, 'DOMContentLoaded', cb);
    },
    sync: function(key, cb) {
      return $.on(window, 'storage', function(e) {
        if (e.key === ("" + g.NAMESPACE + key)) {
          return cb(JSON.parse(e.newValue));
        }
      });
    },
    formData: function(form) {
      var fd, key, val;
      if (form instanceof HTMLFormElement) {
        return new FormData(form);
      }
      fd = new FormData();
      for (key in form) {
        val = form[key];
        if (val) {
          fd.append(key, val);
        }
      }
      return fd;
    },
    ajax: function(url, callbacks, opts) {
      var form, headers, key, r, type, upCallbacks, val;
      if (opts == null) {
        opts = {};
      }
      type = opts.type, headers = opts.headers, upCallbacks = opts.upCallbacks, form = opts.form;
      r = new XMLHttpRequest();
      type || (type = form && 'post' || 'get');
      r.open(type, url, true);
      for (key in headers) {
        val = headers[key];
        r.setRequestHeader(key, val);
      }
      $.extend(r, callbacks);
      $.extend(r.upload, upCallbacks);
      r.send(form);
      return r;
    },
    cache: function(url, cb) {
      var req, reqs, _base;
      reqs = (_base = $.cache).requests || (_base.requests = {});
      if (req = reqs[url]) {
        if (req.readyState === 4) {
          cb.call(req);
        } else {
          req.callbacks.push(cb);
        }
        return;
      }
      req = $.ajax(url, {
        onload: function() {
          var _i, _len, _ref;
          _ref = this.callbacks;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cb = _ref[_i];
            cb.call(this);
          }
        },
        onabort: function() {
          return delete reqs[url];
        },
        onerror: function() {
          return delete reqs[url];
        }
      });
      req.callbacks = [cb];
      return reqs[url] = req;
    },
    cb: {
      checked: function() {
        $.set(this.name, this.checked);
        return Conf[this.name] = this.checked;
      },
      value: function() {
        $.set(this.name, this.value.trim());
        return Conf[this.name] = this.value;
      }
    },
    addStyle: function(css) {
      var style;
      style = $.el('style', {
        textContent: css
      });
      $.add(d.head, style);
      return style;
    },
    x: function(path, root) {
      if (root == null) {
        root = d.body;
      }
      return d.evaluate(path, root, null, 8, null).singleNodeValue;
    },
    addClass: function(el, className) {
      return el.classList.add(className);
    },
    rmClass: function(el, className) {
      return el.classList.remove(className);
    },
    hasClass: function(el, className) {
      return el.classList.contains(className);
    },
    rm: function(el) {
      return el.parentNode.removeChild(el);
    },
    tn: function(s) {
      return d.createTextNode(s);
    },
    nodes: function(nodes) {
      var frag, node, _i, _len;
      if (!(nodes instanceof Array)) {
        return nodes;
      }
      frag = d.createDocumentFragment();
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        frag.appendChild(node);
      }
      return frag;
    },
    add: function(parent, el) {
      return parent.appendChild($.nodes(el));
    },
    prepend: function(parent, el) {
      return parent.insertBefore($.nodes(el), parent.firstChild);
    },
    after: function(root, el) {
      return root.parentNode.insertBefore($.nodes(el), root.nextSibling);
    },
    before: function(root, el) {
      return root.parentNode.insertBefore($.nodes(el), root);
    },
    replace: function(root, el) {
      return root.parentNode.replaceChild($.nodes(el), root);
    },
    el: function(tag, properties) {
      var el;
      el = d.createElement(tag);
      if (properties) {
        $.extend(el, properties);
      }
      return el;
    },
    on: function(el, events, handler) {
      var event, _i, _len, _ref;
      _ref = events.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        el.addEventListener(event, handler, false);
      }
    },
    off: function(el, events, handler) {
      var event, _i, _len, _ref;
      _ref = events.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        el.removeEventListener(event, handler, false);
      }
    },
    open: function(url) {
      return (GM_openInTab || window.open)(url, '_blank');
    },
    queueTask: (function() {
      var execTask, taskChannel, taskQueue;
      taskQueue = [];
      execTask = function() {
        var args, func, task;
        task = taskQueue.shift();
        func = task[0];
        args = Array.prototype.slice.call(task, 1);
        return func.apply(func, args);
      };
      if (window.MessageChannel) {
        taskChannel = new MessageChannel();
        taskChannel.port1.onmessage = execTask;
        return function() {
          taskQueue.push(arguments);
          return taskChannel.port2.postMessage(null);
        };
      } else {
        return function() {
          taskQueue.push(arguments);
          return setTimeout(execTask, 0);
        };
      }
    })(),
    globalEval: function(code) {
      var script;
      script = $.el('script', {
        textContent: code
      });
      $.add(d.head, script);
      return $.rm(script);
    },
    unsafeWindow: window.opera ? window : unsafeWindow !== window ? unsafeWindow : (function() {
      var p;
      p = d.createElement('p');
      p.setAttribute('onclick', 'return window');
      return p.onclick();
    })(),
    shortenFilename: function(filename, isOP) {
      var threshold;
      threshold = isOP ? 40 : 30;
      if (filename.length - 4 > threshold) {
        return "" + filename.slice(0, threshold - 5) + "(...)." + (filename.match(/\w+$/));
      } else {
        return filename;
      }
    },
    bytesToString: function(size) {
      var unit;
      unit = 0;
      while (size >= 1024) {
        size /= 1024;
        unit++;
      }
      size = unit > 1 ? Math.round(size * 100) / 100 : Math.round(size);
      return "" + size + " " + ['B', 'KB', 'MB', 'GB'][unit];
    }
  });

  $.extend($, typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null ? {
    "delete": function(name) {
      return GM_deleteValue(g.NAMESPACE + name);
    },
    get: function(name, defaultValue) {
      var value;
      if (value = GM_getValue(g.NAMESPACE + name)) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      name = g.NAMESPACE + name;
      value = JSON.stringify(value);
      localStorage.setItem(name, value);
      return GM_setValue(name, value);
    }
  } : window.opera ? {
    "delete": function(name) {
      return delete opera.scriptStorage[g.NAMESPACE + name];
    },
    get: function(name, defaultValue) {
      var value;
      if (value = opera.scriptStorage[g.NAMESPACE + name]) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      name = g.NAMESPACE + name;
      value = JSON.stringify(value);
      localStorage.setItem(name, value);
      return opera.scriptStorage[name] = value;
    }
  } : {
    "delete": function(name) {
      return localStorage.removeItem(g.NAMESPACE + name);
    },
    get: function(name, defaultValue) {
      var value;
      if (value = localStorage.getItem(g.NAMESPACE + name)) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      return localStorage.setItem(g.NAMESPACE + name, JSON.stringify(value));
    }
  });

  Board = (function() {

    Board.prototype.toString = function() {
      return this.ID;
    };

    function Board(ID) {
      this.ID = ID;
      this.threads = {};
      this.posts = {};
      g.boards[this] = this;
    }

    return Board;

  })();

  Thread = (function() {

    Thread.prototype.callbacks = [];

    Thread.prototype.toString = function() {
      return this.ID;
    };

    function Thread(ID, board) {
      this.board = board;
      this.ID = +ID;
      this.posts = {};
      g.threads["" + board + "." + this] = board.threads[this] = this;
    }

    return Thread;

  })();

  Post = (function() {

    Post.prototype.callbacks = [];

    Post.prototype.toString = function() {
      return this.ID;
    };

    function Post(root, thread, board) {
      var alt, anchor, bq, capcode, data, date, email, file, flag, i, info, name, node, nodes, post, quotelink, quotes, subject, text, thumb, tripcode, uniqueID, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
      this.thread = thread;
      this.board = board;
      this.ID = +root.id.slice(2);
      post = $('.post', root);
      info = $('.postInfo', post);
      this.nodes = {
        root: root,
        post: post,
        info: info,
        comment: $('.postMessage', post),
        quotelinks: [],
        backlinks: info.getElementsByClassName('backlink')
      };
      this.info = {};
      if (subject = $('.subject', info)) {
        this.nodes.subject = subject;
        this.info.subject = subject.textContent;
      }
      if (name = $('.name', info)) {
        this.nodes.name = name;
        this.info.name = name.textContent;
      }
      if (email = $('.useremail', info)) {
        this.nodes.email = email;
        this.info.email = decodeURIComponent(email.href.slice(7));
      }
      if (tripcode = $('.postertrip', info)) {
        this.nodes.tripcode = tripcode;
        this.info.tripcode = tripcode.textContent;
      }
      if (uniqueID = $('.posteruid', info)) {
        this.nodes.uniqueID = uniqueID;
        this.info.uniqueID = uniqueID.textContent;
      }
      if (capcode = $('.capcode', info)) {
        this.nodes.capcode = capcode;
        this.info.capcode = capcode.textContent;
      }
      if (flag = $('.countryFlag', info)) {
        this.nodes.flag = flag;
        this.info.flag = flag.title;
      }
      if (date = $('.dateTime', info)) {
        this.nodes.date = date;
        this.info.date = new Date(date.dataset.utc * 1000);
      }
      bq = this.nodes.comment.cloneNode(true);
      _ref = $$('.abbr, .capcodeReplies, .exif, b', bq);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        $.rm(node);
      }
      text = [];
      nodes = d.evaluate('.//br|.//text()', bq, null, 7, null);
      for (i = _j = 0, _ref1 = nodes.snapshotLength; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        text.push((data = nodes.snapshotItem(i).data) ? data : '\n');
      }
      this.info.comment = text.join('').replace(/^\n+|\n+$| +(?=\n|$)/g, '');
      quotes = {};
      _ref2 = $$('.quotelink', this.nodes.comment);
      for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
        quotelink = _ref2[_k];
        if (quotelink.hash) {
          this.nodes.quotelinks.push(quotelink);
          if (quotelink.parentNode.parentNode.className === 'capcodeReplies') {
            continue;
          }
          quotes["" + (quotelink.pathname.split('/')[1]) + "." + quotelink.hash.slice(2)] = true;
        }
      }
      this.quotes = Object.keys(quotes);
      if ((file = $('.file', post)) && (thumb = $('img[data-md5]', file))) {
        alt = thumb.alt;
        anchor = thumb.parentNode;
        this.file = {
          info: $('.fileInfo', file),
          text: $('.fileText', file),
          thumb: thumb,
          URL: anchor.href,
          MD5: thumb.dataset.md5,
          size: alt.match(/\d+(\.\d+)?\s\w+$/)[0],
          isSpoiler: $.hasClass(anchor, 'imgspoiler')
        };
        this.file.thumbURL = "" + location.protocol + "//thumbs.4chan.org/" + board + "/thumb/" + (this.file.URL.match(/(\d+)\./)[1]) + "s.jpg";
        this.file.name = $('span[title]', this.file.info).title;
        if (this.file.isImage = /(jpg|png|gif|svg)$/i.test(this.file.name)) {
          this.file.dimensions = this.file.text.textContent.match(/\d+x\d+/)[0];
        }
      }
      this.isReply = $.hasClass(post, 'reply');
      this.clones = [];
      g.posts["" + board + "." + this] = thread.posts[this] = board.posts[this] = this;
    }

    Post.prototype.addClone = function() {
      return new Clone(this);
    };

    Post.prototype.rmClone = function(index) {
      var i, _i, _ref;
      this.clones.splice(index, 1);
      for (i = _i = index, _ref = this.clones.length; index <= _ref ? _i < _ref : _i > _ref; i = index <= _ref ? ++_i : --_i) {
        this.clones[i].nodes.root.setAttribute('data-clone', i);
      }
    };

    return Post;

  })();

  Clone = (function(_super) {

    __extends(Clone, _super);

    function Clone(origin) {
      var file, index, info, inline, inlined, key, nodes, post, quotelink, root, val, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4;
      this.origin = origin;
      _ref = ['ID', 'board', 'thread', 'info', 'quotes', 'isReply'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        this[key] = origin[key];
      }
      nodes = origin.nodes;
      root = nodes.root.cloneNode(true);
      post = $('.post', root);
      info = $('.postInfo', post);
      this.nodes = {
        root: root,
        post: post,
        info: info,
        comment: $('.postMessage', post),
        quotelinks: [],
        backlinks: info.getElementsByClassName('backlink')
      };
      _ref1 = $$('.inline', post);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        inline = _ref1[_j];
        $.rm(inline);
      }
      _ref2 = $$('.inlined', post);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        inlined = _ref2[_k];
        $.rmClass(inlined, 'inlined');
      }
      $.rmClass(root, 'forwarded');
      if (nodes.subject) {
        this.nodes.subject = $('.subject', info);
      }
      if (nodes.name) {
        this.nodes.name = $('.name', info);
      }
      if (nodes.email) {
        this.nodes.email = $('.useremail', info);
      }
      if (nodes.tripcode) {
        this.nodes.tripcode = $('.postertrip', info);
      }
      if (nodes.uniqueID) {
        this.nodes.uniqueID = $('.posteruid', info);
      }
      if (nodes.capcode) {
        this.nodes.capcode = $('.capcode', info);
      }
      if (nodes.flag) {
        this.nodes.flag = $('.countryFlag', info);
      }
      if (nodes.date) {
        this.nodes.date = $('.dateTime', info);
      }
      _ref3 = $$('.quotelink', this.nodes.comment);
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        quotelink = _ref3[_l];
        if (quotelink.hash || $.hasClass(quotelink, 'deadlink')) {
          this.nodes.quotelinks.push(quotelink);
        }
      }
      if (origin.file) {
        this.file = {};
        _ref4 = origin.file;
        for (key in _ref4) {
          val = _ref4[key];
          this.file[key] = val;
        }
        file = $('.file', post);
        this.file.info = $('.fileInfo', file);
        this.file.text = $('.fileText', file);
        this.file.thumb = $('img[data-md5]', file);
      }
      this.isClone = true;
      index = origin.clones.push(this) - 1;
      root.setAttribute('data-clone', index);
    }

    return Clone;

  })(Post);

  Main = {
    init: function() {
      var flatten, key, pathname, val;
      flatten = function(parent, obj) {
        var key, val;
        if (obj instanceof Array) {
          Conf[parent] = obj[0];
        } else if (typeof obj === 'object') {
          for (key in obj) {
            val = obj[key];
            flatten(key, val);
          }
        } else {
          Conf[parent] = obj;
        }
      };
      flatten(null, Config);
      for (key in Conf) {
        val = Conf[key];
        Conf[key] = $.get(key, val);
      }
      pathname = location.pathname.split('/');
      g.BOARD = new Board(pathname[1]);
      if (g.REPLY = pathname[2] === 'res') {
        g.THREAD = +pathname[3];
      }
      switch (location.hostname) {
        case 'boards.4chan.org':
          Main.addStyle();
          Main.initHeader();
          return Main.initFeatures();
        case 'sys.4chan.org':
          break;
        case 'images.4chan.org':
          $.ready(function() {
            var path, url;
            if (Conf['404 Redirect'] && d.title === '4chan - 404 Not Found') {
              path = location.pathname.split('/');
              url = Redirect.image(path[1], path[3]);
              if (url) {
                return location.href = url;
              }
            }
          });
      }
    },
    initHeader: function() {
      Main.header = $.el('div', {
        className: 'reply',
        innerHTML: '<div class=extra></div>'
      });
      localStorage.setItem('4chan_settings', false);
      return $.ready(Main.initHeaderReady);
    },
    initHeaderReady: function() {
      var header, nav, settings, _ref, _ref1, _ref2;
      if (!$.id('navtopr')) {
        return;
      }
      header = Main.header;
      $.prepend(d.body, header);
      nav = $.id('boardNavDesktop');
      header.id = nav.id;
      $.prepend(header, nav);
      nav.id = nav.className = null;
      nav.lastElementChild.hidden = true;
      settings = $.el('span', {
        id: 'settings',
        innerHTML: '[<a href=javascript:;>Settings</a>]'
      });
      $.on(settings.firstElementChild, 'click', Main.settings);
      $.add(nav, settings);
      if ((_ref = $("a[href$='/" + g.BOARD + "/']", nav)) != null) {
        _ref.className = 'current';
      }
      $.addClass(d.body, $.engine);
      $.addClass(d.body, 'fourchan_x');
      if ((_ref1 = $('link[href*=mobile]', d.head)) != null) {
        _ref1.disabled = true;
      }
      return (_ref2 = $.id('boardNavDesktopFoot')) != null ? _ref2.hidden = true : void 0;
    },
    initFeatures: function() {
      if (Conf['Resurrect Quotes']) {
        try {
          Quotify.init();
        } catch (err) {
          $.log(err, 'Resurrect Quotes');
        }
      }
      if (Conf['Quote Inline']) {
        try {
          QuoteInline.init();
        } catch (err) {
          $.log(err, 'Quote Inline');
        }
      }
      if (Conf['Quote Preview']) {
        try {
          QuotePreview.init();
        } catch (err) {
          $.log(err, 'Quote Preview');
        }
      }
      if (Conf['Quote Backlinks']) {
        try {
          QuoteBacklink.init();
        } catch (err) {
          $.log(err, 'Quote Backlinks');
        }
      }
      if (Conf['Time Formatting']) {
        try {
          Time.init();
        } catch (err) {
          $.log(err, 'Time Formatting');
        }
      }
      return $.ready(Main.initFeaturesReady);
    },
    initFeaturesReady: function() {
      var boardChild, posts, thread, threadChild, threads, _i, _j, _len, _len1, _ref, _ref1;
      if (d.title === '4chan - 404 Not Found') {
        if (Conf['404 Redirect'] && g.REPLY) {
          location.href = Redirect.thread(g.BOARD, g.THREAD, location.hash);
        }
        return;
      }
      if (!$.id('navtopr')) {
        return;
      }
      threads = [];
      posts = [];
      _ref = $('.board').children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        boardChild = _ref[_i];
        if (!$.hasClass(boardChild, 'thread')) {
          continue;
        }
        thread = new Thread(boardChild.id.slice(1), g.BOARD);
        threads.push(thread);
        _ref1 = boardChild.children;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          threadChild = _ref1[_j];
          if (!$.hasClass(threadChild, 'postContainer')) {
            continue;
          }
          try {
            posts.push(new Post(threadChild, thread, g.BOARD));
          } catch (err) {
            $.log(threadChild, err);
          }
        }
      }
      Main.callbackNodes(Thread, threads, true);
      return Main.callbackNodes(Post, posts, true);
    },
    callbackNodes: function(klass, nodes, notify) {
      var callback, i, len, _i, _j, _len, _ref;
      len = nodes.length;
      _ref = klass.prototype.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        try {
          for (i = _j = 0; 0 <= len ? _j < len : _j > len; i = 0 <= len ? ++_j : --_j) {
            callback.cb.call(nodes[i]);
          }
        } catch (err) {
          $.log(callback.name, 'crashed. error:', err.message, nodes[i], err);
        }
      }
    },
    settings: function() {
      return alert('Here be settings');
    },
    addStyle: function() {
      $.off(d, 'DOMNodeInserted', Main.addStyle);
      if (d.head) {
        return $.addStyle(Main.css);
      } else {
        return $.on(d, 'DOMNodeInserted', Main.addStyle);
      }
    },
    css: "/* general */\n.dialog.reply {\n  display: block;\n  border: 1px solid rgba(0, 0, 0, .25);\n  padding: 0;\n}\n.move {\n  cursor: move;\n}\nlabel {\n  cursor: pointer;\n}\na[href=\"javascript:;\"] {\n  text-decoration: none;\n}\n.warning {\n  color: red;\n}\n\n/* 4chan style fixes */\n.opContainer, .op {\n  display: block !important;\n}\n.post {\n  overflow: visible !important;\n}\n\n/* header */\nbody.fourchan_x {\n  margin-top: 2.5em;\n}\n#boardNavDesktop.reply {\n  border-width: 0 0 1px;\n  padding: 4px;\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  transition: opacity .1s ease-in-out;\n  -o-transition: opacity .1s ease-in-out;\n  -moz-transition: opacity .1s ease-in-out;\n  -webkit-transition: opacity .1s ease-in-out;\n  z-index: 1;\n}\n#boardNavDesktop.reply:not(:hover) {\n  opacity: .4;\n  transition: opacity 1.5s .5s ease-in-out;\n  -o-transition: opacity 1.5s .5s ease-in-out;\n  -moz-transition: opacity 1.5s .5s ease-in-out;\n  -webkit-transition: opacity 1.5s .5s ease-in-out;\n}\n#boardNavDesktop.reply a {\n  margin: -1px;\n}\n#settings {\n  float: right;\n}\n\n/* quote related */\n.inlined {\n  opacity: .5;\n}\n#qp input, .forwarded {\n  display: none;\n}\n.quotelink.forwardlink,\n.backlink.forwardlink {\n  text-decoration: none;\n  border-bottom: 1px dashed;\n}\n.inline {\n  border: 1px solid rgba(128, 128, 128, .5);\n  display: table;\n  margin: 2px 0;\n}\n.inline .post {\n  border: 0 !important;\n  display: table !important;\n  margin: 0 !important;\n  padding: 1px 2px !important;\n}\n#qp {\n  position: fixed;\n  padding: 2px 2px 5px;\n}\n#qp .post {\n  border: none;\n  margin: 0;\n  padding: 0;\n}\n#qp img {\n  max-height: 300px;\n  max-width: 500px;\n}\n.qphl {\n  outline: 2px solid rgba(216, 94, 49, .7);\n}"
  };

  Redirect = {
    image: function(board, filename) {
      switch (board) {
        case 'a':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'vg':
        case 'wsg':
          return "//archive.foolz.us/" + board + "/full_image/" + filename;
        case 'u':
          return "//nsfw.foolz.us/" + board + "/full_image/" + filename;
        case 'ck':
        case 'lit':
          return "//fuuka.warosu.org/" + board + "/full_image/" + filename;
        case 'cgl':
        case 'g':
        case 'w':
          return "//archive.rebeccablacktech.com/" + board + "/full_image/" + filename;
        case 'an':
        case 'k':
        case 'toy':
        case 'x':
          return "http://archive.heinessen.com/" + board + "/full_image/" + filename;
      }
    },
    post: function(board, postID) {
      switch (board) {
        case 'a':
        case 'co':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'tv':
        case 'v':
        case 'vg':
        case 'wsg':
        case 'dev':
        case 'foolz':
          return "//archive.foolz.us/api/chan/post/board/" + board + "/num/" + postID + "/format/json";
        case 'u':
        case 'kuku':
          return "//nsfw.foolz.us/api/chan/post/board/" + board + "/num/" + postID + "/format/json";
      }
    },
    thread: function(board, threadID, postID) {
      var path, url;
      if (postID) {
        postID = postID.match(/\d+/)[0];
      }
      path = threadID ? "" + board + "/thread/" + threadID : "" + board + "/post/" + postID;
      switch (board) {
        case 'a':
        case 'co':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'tv':
        case 'v':
        case 'vg':
        case 'wsg':
        case 'dev':
        case 'foolz':
          url = "//archive.foolz.us/" + path + "/";
          if (threadID && postID) {
            url += "#" + postID;
          }
          break;
        case 'u':
        case 'kuku':
          url = "//nsfw.foolz.us/" + path + "/";
          if (threadID && postID) {
            url += "#" + postID;
          }
          break;
        case 'ck':
        case 'lit':
          url = "//fuuka.warosu.org/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        case 'diy':
        case 'g':
        case 'sci':
          url = "//archive.installgentoo.net/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        case 'cgl':
        case 'mu':
        case 'soc':
        case 'w':
          url = "//archive.rebeccablacktech.com/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        case 'an':
        case 'fit':
        case 'k':
        case 'mlp':
        case 'r9k':
        case 'toy':
        case 'x':
          url = "http://archive.heinessen.com/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        case 'e':
          url = "https://www.cliché.net/4chan/cgi-board.pl/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        default:
          if (threadID) {
            url = "//boards.4chan.org/" + board + "/";
          }
      }
      return url || '';
    }
  };

  Get = {
    postFromRoot: function(root) {
      var board, index, link, post, postID;
      link = $('a[title="Highlight this post"]', root);
      board = link.pathname.split('/')[1];
      postID = link.hash.slice(2);
      index = root.dataset.clone;
      post = g.posts["" + board + "." + postID];
      if (index) {
        return post.clones[index];
      } else {
        return post;
      }
    },
    postDataFromLink: function(link) {
      var board, path, postID, threadID;
      if (link.host === 'boards.4chan.org') {
        path = link.pathname.split('/');
        board = path[1];
        threadID = path[3];
        postID = link.hash.slice(2);
      }
      return {
        board: board,
        threadID: threadID,
        postID: postID
      };
    },
    postClone: function(board, threadID, postID, root) {
      var clone, origin;
      if (origin = g.posts["" + board + "." + postID]) {
        clone = origin.addClone();
        Main.callbackNodes(Post, [clone]);
        $.add(root, Get.cleanRoot(clone));
        return;
      }
      root.textContent = "Loading post No." + postID + "...";
      if (threadID) {
        return $.cache("/" + board + "/res/" + threadID, function() {
          return Get.parsePost(this, board, threadID, postID, root);
        });
      }
    },
    cleanRoot: function(clone) {
      var child, post, root, _i, _len, _ref, _ref1;
      _ref = clone.nodes, root = _ref.root, post = _ref.post;
      _ref1 = Array.prototype.slice.call(root.childNodes);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        if (child !== post) {
          $.rm(child);
        }
      }
      return root;
    },
    parsePost: function(req, board, threadID, postID, root) {
      var clone, doc, href, inBoard, inThread, link, pc, post, quote, status, _i, _len, _ref;
      status = req.status;
      if (status !== 200) {
        $.addClass(root, 'warning');
        root.textContent = status === 404 ? "Thread No." + threadID + " has not been found." : "Error " + req.status + ": " + req.statusText + ".";
        return;
      }
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = req.response;
      if (!(pc = doc.getElementById("pc" + postID))) {
        root.textContent = "Post No." + postID + " has not been found.";
        return;
      }
      pc = d.importNode(pc, true);
      _ref = $$('.quotelink', pc);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "/" + board + "/res/" + href;
      }
      link = $('a[title="Highlight this post"]', pc);
      link.href = "/" + board + "/res/" + threadID + "#p" + postID;
      link.nextSibling.href = "/" + board + "/res/" + threadID + "#q" + postID;
      inBoard = g.boards[board] || new Board(board);
      inThread = g.threads["" + board + "." + threadID] || new Thread(threadID, inBoard);
      post = new Post(pc, inThread, inBoard);
      Main.callbackNodes(Post, [post]);
      if (!root.parentNode) {
        return;
      }
      clone = post.addClone();
      Main.callbackNodes(Post, [clone]);
      return $.replace(root.firstChild, Get.cleanRoot(clone));
    }
  };

  Quotify = {
    init: function() {
      return Post.prototype.callbacks.push({
        name: 'Resurrect Quotes',
        cb: this.node
      });
    },
    node: function() {
      var ID, a, board, data, i, index, m, node, nodes, quote, quoteID, quotes, snapshot, text, _i, _j, _len, _ref;
      if (this.isClone) {
        return;
      }
      snapshot = d.evaluate('.//text()[not(parent::a)]', this.nodes.comment, null, 6, null);
      for (i = _i = 0, _ref = snapshot.snapshotLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        node = snapshot.snapshotItem(i);
        data = node.data;
        if (!(quotes = data.match(/>>(>\/[a-z\d]+\/)?\d+/g))) {
          continue;
        }
        nodes = [];
        for (_j = 0, _len = quotes.length; _j < _len; _j++) {
          quote = quotes[_j];
          index = data.indexOf(quote);
          if (text = data.slice(0, index)) {
            nodes.push($.tn(text));
          }
          ID = quote.match(/\d+$/)[0];
          board = (m = quote.match(/^>>>\/([a-z\d]+)/)) ? m[1] : this.board.ID;
          quoteID = "" + board + "." + ID;
          if (this.quotes.indexOf(quoteID) === -1) {
            this.quotes.push(quoteID);
          }
          a = $.el('a', {
            textContent: quote,
            className: 'quotelink deadlink'
          });
          this.nodes.quotelinks.push(a);
          nodes.push(a);
          data = data.slice(index + quote.length);
        }
        if (data) {
          nodes.push($.tn(data));
        }
        $.replace(node, nodes);
      }
    }
  };

  QuoteInline = {
    init: function() {
      return Post.prototype.callbacks.push({
        name: 'Quote Inline',
        cb: this.node
      });
    },
    node: function() {
      var link, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.nodes.quotelinks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        $.on(link, 'click', QuoteInline.toggle);
      }
      _ref1 = this.nodes.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        link = _ref1[_j];
        $.on(link, 'click', QuoteInline.toggle);
      }
    },
    toggle: function(e) {
      var board, postID, threadID, _ref;
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      _ref = Get.postDataFromLink(this), board = _ref.board, threadID = _ref.threadID, postID = _ref.postID;
      if ($.hasClass(this, 'inlined')) {
        QuoteInline.rm(this, board, threadID, postID);
      } else {
        if ($.x("ancestor::div[@id='p" + postID + "']", this)) {
          return;
        }
        QuoteInline.add(this, board, threadID, postID);
      }
      return this.classList.toggle('inlined');
    },
    add: function(quotelink, board, threadID, postID) {
      var inline, isBacklink, post, root;
      inline = $.el('div', {
        id: "i" + postID,
        className: 'inline'
      });
      root = (isBacklink = $.hasClass(quotelink, 'backlink')) ? quotelink.parentNode.parentNode : $.x('ancestor-or-self::*[parent::blockquote][1]', quotelink);
      $.after(root, inline);
      Get.postClone(board, threadID, postID, inline);
      if (!(board === g.BOARD.ID && $.x("ancestor::div[@id='t" + threadID + "']", quotelink))) {
        return;
      }
      post = g.posts["" + board + "." + postID];
      if (isBacklink && Conf['Forward Hiding']) {
        $.addClass(post.nodes.root, 'forwarded');
        return post.forwarded++ || (post.forwarded = 1);
      }
    },
    rm: function(quotelink, board, threadID, postID) {
      var el, inThreadID, inline, inlines, post, root, _i, _len, _ref;
      root = $.hasClass(quotelink, 'backlink') ? quotelink.parentNode.parentNode : $.x('ancestor-or-self::*[parent::blockquote][1]', quotelink);
      root = $.x("following-sibling::div[@id='i" + postID + "'][1]", root);
      $.rm(root);
      if (!(el = root.firstElementChild)) {
        return;
      }
      post = g.posts["" + board + "." + postID];
      post.rmClone(el.dataset.clone);
      inThreadID = $.x('ancestor::div[@class="thread"]', quotelink).id.slice(1);
      if (Conf['Forward Hiding'] && board === g.BOARD.ID && threadID === inThreadID && $.hasClass(quotelink, 'backlink')) {
        if (!--post.forwarded) {
          delete post.forwarded;
          $.rmClass(post.nodes.root, 'forwarded');
        }
      }
      inlines = $$('.inlined', el);
      for (_i = 0, _len = inlines.length; _i < _len; _i++) {
        inline = inlines[_i];
        _ref = Get.postDataFromLink(inline), board = _ref.board, threadID = _ref.threadID, postID = _ref.postID;
        root = $.hasClass(inline, 'backlink') ? inline.parentNode.parentNode : $.x('ancestor-or-self::*[parent::blockquote][1]', inline);
        root = $.x("following-sibling::div[@id='i" + postID + "'][1]", root);
        if (!(el = root.firstElementChild)) {
          continue;
        }
        post = g.posts["" + board + "." + postID];
        post.rmClone(el.dataset.clone);
        if (Conf['Forward Hiding'] && board === g.BOARD.ID && threadID === inThreadID && $.hasClass(inline, 'backlink')) {
          if (!--post.forwarded) {
            delete post.forwarded;
            $.rmClass(post.nodes.root, 'forwarded');
          }
        }
      }
    }
  };

  QuotePreview = {
    init: function() {
      return Post.prototype.callbacks.push({
        name: 'Quote Preview',
        cb: this.node
      });
    },
    node: function() {
      var link, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.nodes.quotelinks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        $.on(link, 'mouseover', QuotePreview.mouseover);
      }
      _ref1 = this.nodes.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        link = _ref1[_j];
        $.on(link, 'mouseover', QuotePreview.mouseover);
      }
    },
    mouseover: function(e) {
      var board, clone, origin, post, postID, posts, qp, quote, quoterID, threadID, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      if ($.hasClass(this, 'inlined')) {
        return;
      }
      if (UI.el) {
        return;
      }
      _ref = Get.postDataFromLink(this), board = _ref.board, threadID = _ref.threadID, postID = _ref.postID;
      qp = UI.el = $.el('div', {
        id: 'qp',
        className: 'reply dialog'
      });
      UI.hover(e);
      Get.postClone(board, threadID, postID, qp);
      $.add(d.body, qp);
      $.on(this, 'mousemove', UI.hover);
      $.on(this, 'mouseout click', QuotePreview.mouseout);
      if (!(origin = g.posts["" + board + "." + postID])) {
        return;
      }
      if (Conf['Quote Highlighting']) {
        posts = [origin].concat(origin.clones);
        posts.pop();
        for (_i = 0, _len = posts.length; _i < _len; _i++) {
          post = posts[_i];
          $.addClass(post.nodes.post, 'qphl');
        }
      }
      quoterID = $.x('ancestor::*[@id][1]', this).id.match(/\d+$/)[0];
      clone = Get.postFromRoot(qp.firstChild);
      _ref1 = clone.nodes.quotelinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
        if (quote.hash.slice(2) === quoterID) {
          $.addClass(quote, 'forwardlink');
        }
      }
      _ref2 = clone.nodes.backlinks;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        quote = _ref2[_k];
        if (quote.hash.slice(2) === quoterID) {
          $.addClass(quote, 'forwardlink');
        }
      }
    },
    mouseout: function(e) {
      var clone, post, root, _i, _len, _ref;
      root = UI.el.firstElementChild;
      UI.hoverend();
      $.off(this, 'mousemove', UI.hover);
      $.off(this, 'mouseout click', QuotePreview.mouseout);
      if (!root) {
        return;
      }
      clone = Get.postFromRoot(root);
      post = clone.origin;
      post.rmClone(root.dataset.clone);
      if (!Conf['Quote Highlighting']) {
        return;
      }
      _ref = [post].concat(post.clones);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        post = _ref[_i];
        $.rmClass(post.nodes.post, 'qphl');
      }
    }
  };

  QuoteBacklink = {
    init: function() {
      var format;
      format = Conf['backlink'].replace(/%id/g, "' + id + '");
      this.funk = Function('id', "return '" + format + "'");
      this.containers = {};
      Post.prototype.callbacks.push({
        name: 'Quote Backlinking Part 1',
        cb: this.firstNode
      });
      return Post.prototype.callbacks.push({
        name: 'Quote Backlinking Part 2',
        cb: this.secondNode
      });
    },
    firstNode: function() {
      var a, clone, container, containers, link, post, quote, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      if (this.isClone || !this.quotes.length) {
        return;
      }
      a = $.el('a', {
        href: "/" + this.board + "/res/" + this.thread + "#p" + this,
        className: 'backlink',
        textContent: QuoteBacklink.funk(this.ID)
      });
      _ref = this.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        containers = [QuoteBacklink.getContainer(quote)];
        if (post = g.posts[quote]) {
          _ref1 = post.clones;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            clone = _ref1[_j];
            containers.push(clone.nodes.backlinkContainer);
          }
        }
        for (_k = 0, _len2 = containers.length; _k < _len2; _k++) {
          container = containers[_k];
          link = a.cloneNode(true);
          if (Conf['Quote Preview']) {
            $.on(link, 'mouseover', QuotePreview.mouseover);
          }
          if (Conf['Quote Inline']) {
            $.on(link, 'click', QuoteInline.toggle);
          }
          $.add(container, [$.tn(' '), link]);
        }
      }
    },
    secondNode: function() {
      var container;
      if (this.isClone && this.origin.nodes.backlinkContainer) {
        this.nodes.backlinkContainer = $('.container', this.nodes.info);
        return;
      }
      if (!(Conf['OP Backlinks'] || this.isReply)) {
        return;
      }
      container = QuoteBacklink.getContainer("" + this.board + "." + this);
      this.nodes.backlinkContainer = container;
      return $.add(this.nodes.info, container);
    },
    getContainer: function(id) {
      var _base;
      return (_base = this.containers)[id] || (_base[id] = $.el('span', {
        className: 'container'
      }));
    }
  };

  Time = {
    init: function() {
      this.funk = this.createFunc();
      return Post.prototype.callbacks.push({
        name: 'Time Formatting',
        cb: this.node
      });
    },
    node: function() {
      if (this.isClone) {
        return;
      }
      return this.nodes.date.textContent = Time.funk(Time, this.info.date);
    },
    createFunc: function() {
      var code;
      code = Conf['time'].replace(/%([A-Za-z])/g, function(s, c) {
        if (c in Time.formatters) {
          return "' + Time.formatters." + c + ".call(date) + '";
        } else {
          return s;
        }
      });
      return Function('Time', 'date', "return '" + code + "'");
    },
    day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    zeroPad: function(n) {
      if (n < 10) {
        return "0" + n;
      } else {
        return n;
      }
    },
    formatters: {
      a: function() {
        return Time.day[this.getDay()].slice(0, 3);
      },
      A: function() {
        return Time.day[this.getDay()];
      },
      b: function() {
        return Time.month[this.getMonth()].slice(0, 3);
      },
      B: function() {
        return Time.month[this.getMonth()];
      },
      d: function() {
        return Time.zeroPad(this.getDate());
      },
      e: function() {
        return this.getDate();
      },
      H: function() {
        return Time.zeroPad(this.getHours());
      },
      I: function() {
        return Time.zeroPad(this.getHours() % 12 || 12);
      },
      k: function() {
        return this.getHours();
      },
      l: function() {
        return this.getHours() % 12 || 12;
      },
      m: function() {
        return Time.zeroPad(this.getMonth() + 1);
      },
      M: function() {
        return Time.zeroPad(this.getMinutes());
      },
      p: function() {
        if (this.getHours() < 12) {
          return 'AM';
        } else {
          return 'PM';
        }
      },
      P: function() {
        if (this.getHours() < 12) {
          return 'am';
        } else {
          return 'pm';
        }
      },
      S: function() {
        return Time.zeroPad(this.getSeconds());
      },
      y: function() {
        return this.getFullYear() - 2000;
      }
    }
  };

  Main.init();

}).call(this);
