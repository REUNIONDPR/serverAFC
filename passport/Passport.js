const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT      = require('passport-jwt');
const ExtractJWT       = passportJWT.ExtractJwt;
const JWTStrategy      = passportJWT.Strategy;
const pool = require('../config/db.config');

passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'idgasi',
        passwordField: 'password',
        session: false,
      }, (idgasi, password, done) => {
        let sql = 'SELECT * FROM user WHERE idgasi = ?';
        pool.getConnection(function(error, conn){
          if(error) throw err;
          conn.query(sql, [idgasi], (err, result) => {
            conn.release();
            if(err){return done(err);}
            else if(!result.length){
              return done(null, 'aze', {message:'Non reconnu'});
            }
            console.log('localStrat')
            if (password===result[0].password){
              let user = {idgasi:result[0].idgasi,
                nom:result[0].nom,
                mail:result[0].mail,
                fonction:result[0].fonction,}
              return done(null, user);
            }else{
              return done(null, false, { message: 'Password incorrect' });
            }
            
          });
        });
      },
    ),
  );
  
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'coucou',
      },
      function(jwtPayload, done){
        return done(null, jwtPayload);
      },
    ),
  );