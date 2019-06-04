var rules={} //git test
var pos=[1,1]
var grid=[]
var auto=document.getElementById("auto")
var see=document.getElementById("see")
var level=0;
var levels=[
	"1;1;10;10>bbbbbbbbbb.baaaaaaaab.babbbbbbab.baaaaaabab.bbbbbbabab.bbbaaaabab.bbaaaaabab.baaacbbbab.baaaaaaaab.bbbbbbbbbb.",
	"1;1;10;10>bbbbbbbbbb.baaaaaaaab.bbbbbbbbab.baaaaaaaab.bbbbbabbab.baaaacaaab.bbbbbbbbab.baaaaaaaab.bbbbbbbbab.bbbbbbbbbb.",
	"4;4;10;10>bbbbbbbbbb.baaaaaaaab.baaaaaaaab.baabbbaaab.baababaaab.baabbbaaab.baaaaaaaab.baaaaaaaab.bccccccccb.bccccccccb."
]
see.onclick=function(e){
	displayGrid()
}
var autoint=0
auto.onclick=function(e){
	if (auto.checked){
		autoint=setInterval(attemptAutoMove,1000/10)
	} else {
		clearInterval(autoint)
	}
}
for (var i=0;i<10;i++){
	grid[i]=[]
	for (var j=0;j<10;j++){
		grid[i][j]=0
	}
	
}
for (var i=0;i<grid.length;i++){
	grid[i][0]=1
	grid[i][grid.length-1]=1
	for (var j=0;j<grid[i].length;j++){
		grid[0][j]=1
		grid[grid.length-1][j]=1
	}
}
function parseLevel(s){
	var tmp=s.split(";")
	pos=[parseInt(tmp[0]),parseInt(tmp[1])]
	var w=parseInt(tmp[2])
	var h=parseInt(tmp[3].split(">")[0])
	tmp=s.split(">")[1].split("!").join("").split(".")
	rules={}
	grid=[]
	for (var i=0;i<tmp.length;i++){
		grid[i]=[]
		for (var j=0;j<tmp[i].length;j++){
			switch (tmp[i][j]){
				case "a": grid[i][j]=0;break;
				case "b": grid[i][j]=1;break;
				case "c": grid[i][j]=2;break;
			}
		}
	}
	displayGrid()
}
parseLevel(levels[level])
function attemptAutoMove(){
	if (isRule()){
		attemptMove()
	}
}
function sts(loc){
	if (loc==undefined){
		loc=pos
	}
	var res=""
	res+=grid[loc[0]-1][loc[1]-1]
	res+=grid[loc[0]][loc[1]-1]
	res+=grid[loc[0]+1][loc[1]-1]
	res+=grid[loc[0]-1][loc[1]]
	res+=grid[loc[0]+1][loc[1]]
	res+=grid[loc[0]-1][loc[1]+1]
	res+=grid[loc[0]][loc[1]+1]
	res+=grid[loc[0]+1][loc[1]+1]
	return res
}
function isRule(){
	return rules[sts()]!==undefined
}
function a(){
	if (isRule()){
		switch (rules[sts()]){
			case 0:
				pos[0]++
			break;
			case 1:
				pos[1]++
			break;
			case 2:
				pos[0]--
			break;
			case 3:
				pos[1]--
			break;
		}
	}
}
function moveallowed(id){
	if (grid[pmoved(id)[0]][pmoved(id)[1]]==1){
		return false
	}
	if (grid[pmoved(id)[0]][pmoved(id)[1]]==2){
		level++
		parseLevel(levels[level])
		return false
	}
	return true
}
function pmoved(id){
	switch(id){
		case 0:
			return [pos[0]+1,pos[1]]
		break;
		case 1:
			return [pos[0],pos[1]+1]
		break;
		case 2:
			return [pos[0]-1,pos[1]]
		break;
		case 3:
			return [pos[0],pos[1]-1]
		break;
	}
}
function attemptMove(id){
	if (isRule()){
		a()
	}else{
		if (moveallowed(id)){
			rules[sts()]=id
			a()
		}
	}
	displayGrid()
}
function displayGrid(){
	var out=document.getElementById("out")
	out.innerHTML=""
	var gridc=[]
	for (var i=0;i<grid.length;i++){
		gridc[i]=[]
		for (var k=0;k<grid[i].length;k++){
			gridc[i][k]=grid[k][i]
			if (see.checked&&grid[k][i]==0&&rules[sts([k,i])]!==undefined){
				gridc[i][k]=movesymnc(rules[sts([k,i])])
			}
		}
	}
	gridc[pos[1]][pos[0]]=currentsym()
	for (var i=0;i<gridc.length;i++){
		out.innerHTML+=gridsym(gridc[i].join(""))+"<br>"
	}
	var outr=document.getElementById("outr")
	outr.innerHTML="<br>Rules:<br><br>"
	for (k in rules){
		var tmp=gridsym(k)
		var sym=movesym(rules[k])
		if (k==sts()){
			sym=sym.split("blue").join("red")
		}
		outr.innerHTML+=tmp.substr(0,3)+"<br>"
		outr.innerHTML+=tmp[3]+sym+tmp[4]+"<br>"
		outr.innerHTML+=tmp.substr(5,3)+"<br><br>"
	}
}
function gridsym(s){
	return s.split("1").join("#").split("0").join(".").split("2").join("F")
}
function currentsym(){
	if (isRule()){
		return movesym(rules[sts()])
	}else{
		return "<span style='color:blue'>@</span>"
	}
}
function movesym(id){
	return "<span style='color:blue'>"+movesymnc(id)+"</span>"
}
function movesymnc(id){
	switch (id){
		case 0:
			return "&gt;"
		break;
		case 1:
			return "v"
		break;
		case 2:
			return "&lt;"
		break;
		case 3:
			return "^"
		break;
	}
}
function handleKey(e){
	switch (e.keyCode){
		case 37:
			attemptMove(2)
		break;
		case 38:
			attemptMove(3)
		break;
		case 39:
			attemptMove(0)
		break;
		case 40:
			attemptMove(1)
		break;
	}
}
document.onkeydown=handleKey
displayGrid()
