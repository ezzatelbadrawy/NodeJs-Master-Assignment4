# NodeJs-Master-Assignment4

<br/>

**In [Assingment#2](https://github.com/ezzatelbadrawy/NodeJs-Master-Assignment2/) I created RESTful APIs for pizza-delivery app.**
<br/>

**In [Assignment#3](https://github.com/ezzatelbadrawy/NodeJs-Master-Assignment3/) I created the GUI for same app.**
<br/>

**In this repository, I added the CLI (Command Line Interface) for same app.**

<br/>

## The CLI of this app contain these commands:

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

<br/>

**Note:**
<br/>
In the implementation of 'recent orders' command I used date filed which added to order data when creating new order.
<br/>
So it was very easy to get recent oders (placed in the last 24 hours) by doing this check:
```javascript
            if(Date.now() - orderData.date <= 24*60*60*1000){
                var line = 'ID: '+orderData.id+' - UserEmail: '+orderData.useremail+' - Price: '+orderData.price+' - Date: '+orderData.date+' - Items: ';
                var numberOfOrderItems = typeof(orderData.orderItmes) == 'object' && orderData.orderItmes instanceof Array && orderData.orderItmes.length > 0 ? orderData.orderItmes.length : 0;
                line+=numberOfOrderItems;
                console.log(line);
                cli.verticalSpace();
                matchedCounter ++;
            }
```

<br/>

But for 'recent users' the issue was different where I have not date field on user data !!
<br/>
So I used the creation-date of user data file, where this file creates when user signup.
<br/>
And to do this check I added new function on data module to list recent files and just call it from cli.responders.recentUsers():
```javascript
// List recent created items in a directory according to input-hours
lib.listRecent = function(dir,hrs,callback){
  fs.readdir(lib.baseDir+dir+'/', function(err,data){
    if(!err && data && data.length > 0){
      var trimmedFileNames = [];
      var now = Date.now();
      var hrsInMs = parseInt(hrs)*60*60*1000;    
      var checkedFilesCounter = 0;        
      data.forEach(function(fileName){
        var path = lib.baseDir+dir+'/'+fileName;
        fs.stat(path, function (err,stats) {
            if(!err && stats){
                var btime = stats.birthtimeMs;      // birthtimeMs/birthtime : time of file creation
                if(now - btime <= hrsInMs){
                    trimmedFileNames.push(fileName.replace('.json',''));                    
                }
            }
            checkedFilesCounter ++;
            if(checkedFilesCounter == data.length){
                callback(false,trimmedFileNames);            
            }            
        });        
      });
    } else {
      callback(err,data);
    }
  });
};
```

<br/>

**Here is some screenshots for CLI of this app:**
<br/>

## CLI Manual:
![1](https://github.com/ezzatelbadrawy/NodeJs-Master-Assignment4/blob/master/screenshots/1-CLI-Commands.png)

<br/>

## Menu Command:
![2](https://github.com/ezzatelbadrawy/NodeJs-Master-Assignment4/blob/master/screenshots/2-menu-command.png)

<br/>

## Orders Commands:
![3](https://github.com/ezzatelbadrawy/NodeJs-Master-Assignment4/blob/master/screenshots/3-orders-commands.png)

<br/>

## Users Commands:
![4](https://github.com/ezzatelbadrawy/NodeJs-Master-Assignment4/blob/master/screenshots/4-users-commands.png)

<br/>


