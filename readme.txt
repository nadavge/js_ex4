What was hard?

--- this exercise proved to be much more complex than the last one, mainly
	because it involved many different parts in order to make the server dynamic.
	We had to divide our code into different prototypes, and had to make sure
	their APIs worked good with one another.

--- handling all the different cases and inputs functions could get.

What was fun?

--- Javascript is a cool and flexible language, it's nice working with it :)

--- we also had quite alot of fun going through express's API and implementation.

--- We used git to manage our code base, and worked side-by-side, stopping for
	mutual code reviews and thinking (and tea).


How did you test your server?

--- As a normal test, we've tested either a case in which the file is actually present,
    a case in which the file shouldn't be found, a case in which the access to the file
    is forbidden, and finally a case of internal error.
    In our load tests, we actually tried several amount of get requests together,
    when implementing it in a for loop is valid because the get requests are a-sync.
	Our statistics show that around 1500 requests the server starts dropping connections.
	We also tested the functionallity of the dynamic routing mechanism, both parameter
	extraction from the url, and also the next mechanism combined.
