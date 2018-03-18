var exports = module.exports = {}


exports.signup = function(req,res){

	res.render('partials/signup'); 

}

exports.signin = function(req,res){

	res.render('partials/signin'); 

}

exports.dashboard = function(req,res){

	res.render('partials/dashboard'); 

}

exports.logout = function(req,res){

  req.session.destroy(function(err) {
  res.redirect('/');
  });

}