## Navigation
change url of links in the nav with relevant urls. replace "href" properties.

    <ul  class="navbar-nav ms-auto me-lg-5 mb-lg-0 fs-5 fw-bold">
	    <li  class="nav-item mx-2">
		    <a  class="nav-link active"  aria-current="page"  href="#">HOME</a>
	    </li>
	    <li  class="nav-item mx-2">
		    <a  class="nav-link"  href="/nav/videos.html">VIDEOS & PODCAST</a>
	    </li>
	    <li  class="nav-item mx-2">
		    <a  class="nav-link"  href="/nav/news.html">NEWSLETTER</a>
	    </li>
	    <li  class="nav-item mx-2">
		    <a  class="nav-link"  href="/nav/about.html">ABOUT</a>
	    </li>
	    <li  class="nav-item mx-2">
		    <a  class="nav-link"  href="/nav/team.html">TEAM</a>
	    </li>
	    <li  class="nav-item mx-2">
		    <a  class="nav-link"  href="/nav/team.html#contact">CONTACT US</a>
	    </li>
    </ul>
It is needed to be replaced in following areas

 - header navigation element in all page
 - logo element in navigation in all page
 - explore link in index.html
 - in footer element in team.html - logo and nav links

## Expected API response

- to render UI in this sample, an example API response in JSON format is used, in the folder /api/
- reading the file is done by the /js/api.js file.
- each page that render dynamic content, uses external .js file to render it.
- in each .js file (team.js, news.js, videos.js) there is **build function** that after fetching data builds the inner html content and also initialise slideshow script by swiper.js library.
- if php is needed to be implemented, I think, the js files needs to be in header area in script tag, with php inside the js functions. Please look into this, I don't know much about this.

```
<?php $fetchData= 'fetching Data codes'; ?>
<html>
  <head>
    <script type="text/javascript">

      function loadNews() {
		// notice the quotes around the ?php tag
		var res="<?php echo $fetchData; ?>";
		...
		...// rest are same
		}
		.... other contents to be copied from *.js file
    </script>
  </head>
  <body>
  ....
  </body>
</html>
```
- however firebase data can be fetched by using js only. that can also be implemented in api.js file if needed.

### video page api response
two types - 1. events, 2. podcasts
expected a response with one featured video (can be event/podcast)
data of events and podcast separately, each having upcoming and available/past videos.

each video has data:

 - **id**: random generated
 - **title**: required
 - **description**: required, html formatted ( bold replaced by `<b>` breaks replaced by `<br>` etc.)
 - **link**: if available video, then youtube link (shortened) thumbnail is fetched from YT
 - **type**: 1 for event or 2 for podcast
 - **isUpcoming**: true/false required
 - **thumbnail**: link of image, if upcoming, it is used, required. (16:9 ratio)

### newsletter page api response
data required with featured and all newsletter.
featured may contain more than one item,
all newsletter data can be limited to reduce firebase read cost.
all news item has a "hasNext" property that is checked by news.js file to show "load more" item. implement the load more code accordingly.

each news item has data:

 - **id**: random generated
 - **month**: required
 - **year**: required
 - **volume**: required
 - **issue**: required
 - **heading**: required, (ABHIVAHYA)
 - **title**: required
 - **link**: required
 - **thumbnail**: required, (16:9 ratio without much text preferred, if larger, upper part will be cropped)
