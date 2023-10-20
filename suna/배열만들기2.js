function solution(l, r) {
    var answer = [];
    for(var i = l; i<= r; i++){
        if(i%5 ==0){
             const set = new Set([...String(i)])
             set.delete("0")
            set.delete("5")
            if(set.size==0){
               answer.push(i)
            }
        }
    }
    if(answer.length == 0){
                   return [-1]
                }
    return answer;
}