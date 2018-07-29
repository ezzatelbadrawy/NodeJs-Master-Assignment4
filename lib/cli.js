/*
 * CLI-related tasks
 *
 */

 // Dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();
var os = require('os');
var v8 = require('v8');
var _data = require('./data');
var _logs = require('./logs');
var helpers = require('./helpers');

// Instantiate the cli module object
var cli = {};


// Create a vertical space
cli.verticalSpace = function(lines){
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
      console.log('');
  }
};

// Create a horizontal line across the screen
cli.horizontalLine = function(){

  // Get the available screen size
  var width = process.stdout.columns;

  // Put in enough dashes to go across the screen
  var line = '';
  for (i = 0; i < width; i++) {
      line+='-';
  }
  console.log(line);


};

// Create centered text on the screen
cli.centered = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding there should be
  var leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  var line = '';
  for (i = 0; i < leftPadding; i++) {
      line+=' ';
  }
  line+= str;
  console.log(line);
};


/*=======================================================================================*/
// Input handlers

e.on('man',function(str){
  cli.responders.help();
});

e.on('help',function(str){
  cli.responders.help();
});

e.on('exit',function(str){
  cli.responders.exit();
});

e.on('stats',function(str){
  cli.responders.stats();
});

e.on('clear',function(str){
  cli.responders.clear();
});

e.on('list menu',function(str){
  cli.responders.listMenu(str);
});

e.on('recent orders',function(str){
  cli.responders.recentOrders(str);
});

e.on('list orders',function(str){
  cli.responders.listOrders();
});

e.on('order details',function(str){
  cli.responders.orderDetails(str);
});

e.on('recent users',function(str){
  cli.responders.recentUsers();
});

e.on('list users',function(str){
  cli.responders.listUsers();
});

e.on('more user info',function(str){
  cli.responders.moreUserInfo(str);
});

e.on('list logs',function(str){
  cli.responders.listLogs();
});

e.on('more log info',function(str){
  cli.responders.moreLogInfo(str);
});
/*=======================================================================================*/


/*=======================================================================================*/
// Responders

// Container for all the responders methods
cli.responders = {};


// Help / Man
cli.responders.help = function(){

  // Codify the commands and their explanations
  var commands = {
    'exit' : 'Kill the CLI (and the rest of the application)',
    'man' : 'Show this help page',
    'help' : 'Alias of the "man" command',
    'stats' : 'Get statistics on the underlying operating system and resource utilization',
    'clear' : 'Cleanup console window',      
    'list menu' : 'Show a list of all menu items',
    'recent orders' : 'Show a list of orders placed in the last 24 hours',
    'list orders' : 'Show a list of all orders in the system',      
    'order details --{orderId}' : 'Show details of a specified order',      
    'recent users' : 'Show a list of all the users who have signed up in the last 24 hours',            
    'list users' : 'Show a list of all the registered (undeleted) users in the system',
    'more user info --{userId}' : 'Show details of a specified user',
    'list logs' : 'Show a list of all the log files available to be read (compressed and uncompressed)',
    'more log info --{logFileName}' : 'Show details of a specified log file',
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for(var key in commands){
     if(commands.hasOwnProperty(key)){
        var value = commands[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        cli.verticalSpace();
     }
  }
  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();

};

// Exit
cli.responders.exit = function(){
  process.exit(0);
};

// Stats
cli.responders.stats = function(){
  // Compile an object of stats
  var stats = {
    'Load Average' : os.loadavg().join(' '),
    'CPU Count' : os.cpus().length,
    'Free Memory' : os.freemem(),
    'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime' : os.uptime()+' Seconds'
  };

  // Create a header for the stats
  cli.horizontalLine();
  cli.centered('SYSTEM STATISTICS');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Log out each stat
  for(var key in stats){
     if(stats.hasOwnProperty(key)){
        var value = stats[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        cli.verticalSpace();
     }
  }

  // Create a footer for the stats
  cli.verticalSpace();
  cli.horizontalLine();

};

// Clear console (like as cls)
cli.responders.clear = function(){
  //console.log('\033[2J');
  //process.stdout.write("\u001b[2J\u001b[0;0H");
  //process.stdout.write('\033c');
  console.clear();    
};

// List Menu Items
cli.responders.listMenu = function(){
    _data.read('menu','menitems',function(err,data){
      if(!err && data){
        var menuItems = data.menu.items;
        if(menuItems){
            menuItems.forEach(function(mItem){
                cli.verticalSpace();
                console.dir(mItem,{'colors' : true});
                cli.verticalSpace();                    
            });
        }
      } else {
        cli.verticalSpace();
        console.log('Empty Menu List !!');  
        cli.verticalSpace();
      }
    });          
};

// List Recent Orders (orders placed in the last 24 hours)
cli.responders.recentOrders = function(){
  _data.list('orders',function(err,orderIds){
    if(!err && orderIds && orderIds.length > 0){
      var matchedCounter = 0;
      var processedCounter = 0;        
      cli.verticalSpace();
      orderIds.forEach(function(orderId){
        _data.read('orders',orderId,function(err,orderData){
          if(!err && orderData){
            if(Date.now() - orderData.date <= 24*60*60*1000){
                var line = 'ID: '+orderData.id+' - UserEmail: '+orderData.useremail+' - Price: '+orderData.price+' - Date: '+orderData.date+' - Items: ';
                var numberOfOrderItems = typeof(orderData.orderItmes) == 'object' && orderData.orderItmes instanceof Array && orderData.orderItmes.length > 0 ? orderData.orderItmes.length : 0;
                line+=numberOfOrderItems;
                console.log(line);
                cli.verticalSpace();
                matchedCounter ++;
            }
            processedCounter ++;
            if(processedCounter == orderIds.length && matchedCounter == 0){
                cli.verticalSpace();
                console.log('Could not find any order with in the last 24 hours.');
                cli.verticalSpace();
            }
          }
        });
      });
    } else {
        cli.verticalSpace();
        console.log('Empty Orders List !!');
        cli.verticalSpace();
    }
  });
};

// List Orders
cli.responders.listOrders = function(){
  _data.list('orders',function(err,orderIds){
    if(!err && orderIds && orderIds.length > 0){
      var matchedCount = 0;
      cli.verticalSpace();
      orderIds.forEach(function(orderId){
        _data.read('orders',orderId,function(err,orderData){
          if(!err && orderData){
            var line = 'ID: '+orderData.id+' - UserEmail: '+orderData.useremail+' - Price: '+orderData.price+' - Date: '+orderData.date+' - Items: ';
            var numberOfOrderItems = typeof(orderData.orderItmes) == 'object' && orderData.orderItmes instanceof Array && orderData.orderItmes.length > 0 ? orderData.orderItmes.length : 0;
            line+=numberOfOrderItems;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    } else {
        cli.verticalSpace();
        console.log('Empty Orders List !!');
        cli.verticalSpace();
    }
  });
};

// Order Details
cli.responders.orderDetails = function(str){
  // Get ID from string
  var arr = str.split('--');
  var orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(orderId){
    // Lookup the order
    _data.read('orders',orderId,function(err,orderData){
      if(!err && orderData){
        // Print their JSON object with text highlighting
        cli.verticalSpace();
        console.dir(orderData,{'colors' : true});
        cli.verticalSpace();
      }
    });
  } else {
      cli.verticalSpace();
      console.log('Could not find this order !!');
      cli.verticalSpace();
  }
};

// List Recent Users (who have signed up in the last 24 hours)
cli.responders.recentUsers = function(){
  _data.listRecent('users',24,function(err,userIds){
    if(!err && userIds && userIds.length > 0){
      cli.verticalSpace();
      userIds.forEach(function(userId){
        _data.read('users',userId,function(err,userData){
          if(!err && userData){
            var line = 'Name: '+userData.firstName+' '+userData.lastName+' - Email: '+userData.email+' - Address: '+userData.address+' - Orders: ';
            var numberOfOrders = typeof(userData.orders) == 'object' && userData.orders instanceof Array && userData.orders.length > 0 ? userData.orders.length : 0;
            line+=numberOfOrders;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    } else {
        cli.verticalSpace();
        console.log('Could not find any user signed-up with in the last 24 hours.');
        cli.verticalSpace();
    }
  });
};

// List Users
cli.responders.listUsers = function(){
  _data.list('users',function(err,userIds){
    if(!err && userIds && userIds.length > 0){
      cli.verticalSpace();
      userIds.forEach(function(userId){
        _data.read('users',userId,function(err,userData){
          if(!err && userData){
            var line = 'Name: '+userData.firstName+' '+userData.lastName+' - Email: '+userData.email+' - Address: '+userData.address+' - Orders: ';
            var numberOfOrders = typeof(userData.orders) == 'object' && userData.orders instanceof Array && userData.orders.length > 0 ? userData.orders.length : 0;
            line+=numberOfOrders;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    } else {
        cli.verticalSpace();
        console.log('Empty Users List !!');
        cli.verticalSpace();
    }
  });
};

// More user info
cli.responders.moreUserInfo = function(str){
  // Get ID from string
  var arr = str.split('--');
  var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(userId){
    // Lookup the user
    _data.read('users',userId,function(err,userData){
      if(!err && userData){
        // Remove the hashed password
        delete userData.hashedPassword;

        // Print their JSON object with text highlighting
        cli.verticalSpace();
        console.dir(userData,{'colors' : true});
        cli.verticalSpace();
      }
    });
  } else {
      console('Could not find this user !!');
  }
};

// List Logs
cli.responders.listLogs = function(){
  _logs.list(true,function(err,logFileNames){
    if(!err && logFileNames && logFileNames.length > 0){
      cli.verticalSpace();
      logFileNames.forEach(function(logFileName){
        if(logFileName.indexOf('-') > -1){
          console.log(logFileName);
          cli.verticalSpace();
        }
      });
    }
  });
};

// More logs info
cli.responders.moreLogInfo = function(str){
  // Get logFileName from string
  var arr = str.split('--');
  var logFileName = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(logFileName){
    cli.verticalSpace();
    // Decompress it
    _logs.decompress(logFileName,function(err,strData){
      if(!err && strData){
        // Split it into lines
        var arr = strData.split('\n');
        arr.forEach(function(jsonString){
          var logObject = helpers.parseJsonToObject(jsonString);
          if(logObject && JSON.stringify(logObject) !== '{}'){
            console.dir(logObject,{'colors' : true});
            cli.verticalSpace();
          }
        });
      }
    });
  }
};
/*=======================================================================================*/


// Input processor
cli.processInput = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  // Only process the input if the user actually wrote something, otherwise ignore it
  if(str){
    // Codify the unique strings that identify the different unique questions allowed be the asked
    var uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'clear',        
      'list menu',
      'recent orders',
      'list orders',        
      'order details',        
      'recent users',                
      'list users',
      'more user info',
      'list logs',
      'more log info'
    ];

    // Go through the possible inputs, emit event when a match is found
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some(function(input){
      if(str.toLowerCase().indexOf(input) > -1){
        matchFound = true;
        // Emit event matching the unique input, and include the full string given
        e.emit(input,str);
        return true;
      }
    });

    // If no match is found, tell the user to try again
    if(!matchFound){
        cli.verticalSpace();
        console.log("Sorry this command does not exist, please try again");
        cli.verticalSpace();
    }

  }
};

// Init script
cli.init = function(){

  // Send to console, in dark blue
  console.log('\x1b[34m%s\x1b[0m','The CLI is running');

  // Start the interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input separately
  _interface.on('line', function(str){

    // Send to the input processor
    cli.processInput(str);

    // Re-initialize the prompt afterwards
    _interface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  _interface.on('close', function(){
    process.exit(0);
  });

};

// Export the module
module.exports = cli;
