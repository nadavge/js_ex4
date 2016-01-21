var APP_HTML = `
<script src="js/pages.js"></script>
<div class="container">
	<div class="text-center page-header">
		<h1>Exercise 2<br/><small>Nadav Geva</small></h1>
	</div>
	<div id="login" class="page active">
		<div id="messages"></div>
		<form class="login" onsubmit="return login();">
			<div class="form-group">
				<input type="text" id="username" class="form-control" placeholder="Username"/>
				<input type="password" id="password" class="form-control" placeholder="Password"/>
			</div>
			<div class="form-group">
				<input type="submit" class="form-control btn btn-primary" value="Login"/>
			</div>
		</form>
	</div>

	<div id="profile" class="page">
		<h2>Nadav Geva</h2>
		<div class="navigation">
			<button class="btn btn-primary" onclick="changePage('calculator');">Calculator</button>
			<button class="btn btn-danger" onclick="changePage('login');">Logout</button>
		</div>
		<div id="myphoto"></div>
		<p>
			Hey! My name is Nadav, I study <abbr title="Computer Science">CS</abbr> at <a href="http://new.huji.ac.il">The Hebrew University in Jerusalem</a>.<br/>
			I like debugging, version controlling and singing in the shower.
			<blockquote>Why do it today if it's for submission on 23:55 tomorrow?</blockquote>
		</p>
		<p>
			<h4>My hobbies:</h4>
			<ul>
				<li>Jugling</li>
				<li>Jogging</li>
				<li>Jamming</li>
			</ul>
		</p>

	</div>

	<div id="calculator" class="page">
		<button class="btn btn-success" onclick="new Calc();">Add calculator</button>
	</div>
</div>
<script src="js/calc.js"></script>`;

function changePage(page_id) {
	$(".page").removeClass("active");
	$("#"+page_id+".page").addClass("active");
}

function login() {
	var username = $("#username").val();
	var password = $("#password").val();
	if (username === password && password === "admin") {
		changePage("profile");
		message = document.createElement("div");
		$(message).addClass("alert alert-success");
		$(message).text("Logged out successfully!");
		$("#login.page>#messages").html(message);
	} else {
		message = document.createElement("div");
		$(message).addClass("alert alert-danger");
		$(message).text("Invalid username or password");
		$("#login.page>#messages").html(message);
	}

	return false;
}

function logout() {
	changePage("login");
}

$(document).ready(function() {
	$("body").append(APP_HTML);
});

