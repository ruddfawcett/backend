var organization = require('../models/organization.js');
var user = require('../models/user.js');

module.exports = {
  process: function(meta, person) {
    var parent = meta.parent;
    var domain = meta.parent_domain;
    var subdomain = meta.subdomain;

    organization.findOne({ domain : domain }, function(err, resultOrg) {
      if (err) {
        res.status(507).json({
          result: false,
          message: err.message
        });
      }

      if (!resultOrg) {
        var newOrg = {
          domain: domain,
          created_by: user.id,
          parent: true
        }

        organization.create(newOrg, function(err, orgResult) {
          if (err) {
            res.status(507).json({
              result: false,
              message: err.message
            });
          }

          if (orgResult) {
            user.findOneAndUpdate({email : person.email}, {$push: {orgs: orgResult.id}}, function(err, result) {
              if (err) {
                res.status(507).json({
                  result: false,
                  message: err.message
                });
              }

              if (result) {
                return true;
              }
              else {
                res.status(500).json({
                  result: false,
                  message: 'There was an internal error.'
                });
              }
            });

            if (!parent) {
              var subOrg = {
                domain: subdomain,
                created_by: user.id,
                parent: false,
                parent_org: orgResult.id
              };

              organization.create(subOrg, function(err, result) {
                if (err) {
                  res.status(507).json({
                    result: false,
                    message: err.message
                  });
                }

                if (result) {
                  user.findOneAndUpdate({email : person.email}, {$push: {orgs: result.id}}, function(err, result) {
                    if (err) {
                      res.status(507).json({
                        result: false,
                        message: err.message
                      });
                    }

                    if (result) {
                      return true;
                    }
                    else {
                      res.status(500).json({
                        result: false,
                        message: 'There was an internal error.'
                      });
                    }
                  });
                }
              });
            }
            else {
              if (orgResult) return true;
            }
          }
        });
      }
      else {
        if (subdomain) {
          organization.findOne({ domain : subdomain }, function(err, result) {
            if (err) {
              res.status(507).json({
                result: false,
                message: err.message
              });
            }

            if (!result) {
              var subOrg = {
                domain: subdomain,
                created_by: user.id,
                parent: false,
                parent_org: result.id
              };

              organization.create(subOrg, function(err, result) {
                if (err) {
                  res.status(507).json({
                    result: false,
                    message: err.message
                  });
                }

                if (result) {
                  user.findOneAndUpdate({email : person.email}, {$push: {orgs: result.id}}, function(err, result) {
                    if (err) {
                      res.status(507).json({
                        result: false,
                        message: err.message
                      });
                    }

                    if (result) {
                      return true;
                    }
                    else {
                      res.status(500).json({
                        result: false,
                        message: 'There was an internal error.'
                      });
                    }
                  });
                }

                res.status(500).json({
                  result: false,
                  message: 'There was an internal error.'
                });
              });
            }
          });
        }
        else {
          
        }
      }
    });
  }
}
