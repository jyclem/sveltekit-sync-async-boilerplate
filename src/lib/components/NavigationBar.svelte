<ul>
	<li><a href="/sync">Sync</a></li>
	<li><a href="/polling">Async - Polling</a></li>
	<li><a href="/websocket">Async - Websocket</a></li>
	<li><a href="/websocket-enhanced">Async - Websocket Enhanced</a></li>
</ul>

<style lang="scss">
	ul {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		list-style-type: none;
		margin: 0;
		padding: 0 20%;
		overflow: hidden;
		background-color: #333;

		li {
			flex: 1 1 0px;
			float: left;

			a {
				display: block;
				color: white;
				text-align: center;
				padding: 14px 16px;
				text-decoration: none;
			}

			&:hover {
				background-color: white;
				a {
					color: #333;
				}
			}
		}
	}
</style>
