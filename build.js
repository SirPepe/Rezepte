var fs = require('fs');
var blacklist = [ '.git' ];

function readDir(dir, index){
  var links = [];
  fs.readdirSync(dir).forEach(function(item){
    var fullPath = (dir === '.' ? '' : dir + '/') + item;
    var stat = fs.statSync(fullPath);
    if(stat.isDirectory() && blacklist.indexOf(item) === -1){
      index[item] = readDir(item);
    }
    else if(stat.isFile()){
      links.push('[' + item + '](' + fullPath + ')');
    }
  });
  return links;
}

var index = {};
readDir('.', index);

function print(index){
  var output = "Rezepte\n=======";
  for(var key in index){
    output += "\n\n";
    output += key + "\n";
    output += new Array(key.length).join('-') + '-';
    output += "\n\n";
    index[key].forEach(function(file){
      output += "* " + file + "\n";
    });
  }
  return output;
}

var markdown = print(index);
fs.writeFileSync('readme.md', markdown, 'utf-8');