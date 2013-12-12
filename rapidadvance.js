var app = angular.module('rapidadvance', []);
app.directive("rapidadvance", function($compile, $location, $anchorScroll){
    return {
        restrict : 'A',
        link:function($scope, element, attr){
            var ra = ($scope.rapidadvance || ($scope.rapidadvance = {}));
            if(!attr['ngModel'] || !attr['rapidadvanceItems']){
                console.log('rapidadvance must have ng-model and items');
                return;
            }
            
            
            
            var _this = (ra[attr['ngModel']] || (ra[attr['ngModel']] = {}));
            
            if(attr['rapidadvanceCaseInsentive'] == undefined){
                _this.case_insensitive = true;
            }else{
                _this.case_insensitive = (attr['rapidadvanceCaseInsentive'] == 'true')?true:false;
            }
            _this.name = attr['ngModel'];
            _this.items = [];
            _this.selected_index = 0;
            _this.element = element;
            if(attr['rapidadvanceSelected']){
                var expr = attr['rapidadvanceSelected'];
                var args = expr.match(/\(\s*(.*?)\s*(,.*?)?\)/);
                var option = {};
                var arg = null;
                if(args){
                    arg = args[1];
                }
                _this.changeModel = function(){
                    if(arg){
                        option[arg] = _this.items[_this.selected_index];
                    }
                    $scope.$eval(expr, option);
                }
            }else{
                _this.changeModel = function(val){
                    $scope.$eval(attr['ngModel']+' = "'+val.toString().replace(/\\/g,'\\\\').replace(/"/g, '\\"')+'"');
                }
            }
            
            function getItems(){
                return $scope.$eval(attr['rapidadvanceItems']);
            }
            
            var input_key = [];
            
            var scroll_offset = 30; //if you want change li height, you must change here
            var menu_height = 300;  //
            
            var show_item_num = Math.floor(menu_height / scroll_offset);
            var show_bottom = show_item_num-1;
            
            //style
            var style = _this.style = {};
            style.div = {display:'none', position:'absolute'};
            style.ul = {display:'inline-block'};
            style.li = {};
            style.selected = {};
            
            var _div = angular.element('<div ng-style="rapidadvance[\''+_this.name+'\'].style.div" class="rapidadvance-div"></div>');
            var _ul = angular.element('<ul ng-style="rapidadvance[\''+_this.name+'\'].style.ul" class="rapidadvance-ul"></ul>');
            var _li = angular.element('<li ng-style="rapidadvance[\''+_this.name+'\'].style.li"  ng-repeat="i in rapidadvance[\''+_this.name+'\'].items track by $index" class="rapidadvance-li" ng-class="{\'rapidadvance-selected\':$index == rapidadvance[\''+_this.name+'\'].selected_index}" ng-mousedown="mousedown(\''+_this.name+'\',i)" ng-mouseenter="mouseenter(\''+_this.name+'\',i, $index)">{{i.show}}</li>')
            var menu = _div.append(_ul.append(_li));
            $compile(menu)($scope);
            element.after(menu);
            
            var elem_div = element.next();
            var raw_elem_div = elem_div[0];
            var raw_elem_ul = elem_div.find('ul')[0];
            
            _this.raw = {input:element[0],div:raw_elem_div, ul:raw_elem_ul};
            
            element.on('keyup', keyup);
            element.on('keydown', keydown);
            element.on('focus', focus);
            element.on('blur', blur);
            
            $scope.mouseenter = function(model,$event, $index){
                var _this = ra[model];
                _this.selected_index = $index;
                reloadDropDown(_this);
            }
            
            $scope.mousedown = function(model, item){
                var _this = ra[model];
                _this.changeModel(item.match);
            }
            
            function viewScroll(){
                var _top = raw_elem_ul.scrollTop / scroll_offset;
                var _bottom = _top+show_bottom;
                if(_this.selected_index > _bottom){
                    raw_elem_ul.scrollTop = (_this.selected_index-show_bottom) * scroll_offset;
                }else if(_this.selected_index < _top){
                    raw_elem_ul.scrollTop = _this.selected_index * scroll_offset;
                }
            }
            
            function showMenu(_this){
                var input = _this.raw.input;
                var top = input.offsetTop + input.offsetHeight;
                var left = input.offsetLeft;
                
                
                _this.style.div.display = 'block';
                _this.style.div.top = top + 'px';
                _this.style.div.left = left + 'px';
                
            }
            
            function hideMenu(_this){
                _this.style.div.display = 'none';
            }
            
            function keyup($event){
                $scope.$apply(function(){
                    switch($event.which){
                        case 13:
                            if(_this.items.length > 0){
                                _this.changeModel(_this.items[_this.selected_index].match);
                                hideMenu(_this);
                            }
                            return;
                        case 27:    //ESC
                            hideMenu(_this);
                            return;
                        case 38:    //KEY_UP
                            if(_this.selected_index > 0) _this.selected_index--;
                            viewScroll();
                            break;
                        case 40:    //KEY_DOWN
                            if(_this.selected_index < _this.items.length-1)_this.selected_index++;
                            viewScroll();
                            break;
                        default:
                            break;
                    }
                    reloadDropDown(_this);
                });
            }
            
            function keydown($event){
            }
            
            function focus($event){
                $scope.$apply(function(){
                    reloadDropDown(_this);
                });
            }
            
            function blur($event){
                $scope.$apply(function(){
                    hideMenu(_this);
                });
            }
            
            function reloadDropDown(_this){
                var val = _this.element.val()
                if(_this.case_insensitive){
                    val = val.toLowerCase();
                }
                var result = [];
                var items = getItems();
                var count = 0;
                var first = 0;
                for(var i in items){
                    var key = items[i].key || items[i];
                    var origin_key = key;
                    if(key instanceof Array){
                    }else{
                        key = [key];
                    }
                    
                    for(var j in key){
                        var _key = key[j];
                        var _origin_key = _key;
                        if(_this.case_insensitive){
                            _key = _key.toLowerCase();
                        }
                        
                        if(val.length == 0 || _key.indexOf(val) >= 0){
                            count++;
                            var show = items[i].show || _origin_key;
                            var value = items[i].value || _origin_key;
                            result.push({key:origin_key,show:show,value:value, match:_origin_key});
                            break;
                        }
                    }
                }
                
                if(_this.selected_index >= count) _this.selected_index = count - 1;
                _this.items = result;
                
                if(_this.items.length == 0){
                    _this.selected_index = 0;
                    hideMenu(_this);
                    _this.style.div.display = 'none';
                }else{
                    showMenu(_this);
                }
            }
        }
    };
});