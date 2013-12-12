RapidAdvanceJS
======================
RapidAdvanceJSはAngularJS用のオートコンプリートライブラリです。  
[サンプル](http://yysk.jp/RapidAdvance/ "サンプル")  


使い方
------
``input``タグに``rapidadvance``,``rapid-advance-items``要素を追加すると使えます。  
``input``タグには``ng-model``要素が必ず必要です。  
``rapidadvance-selected``,``rapidadvance-case-insentive``要素をオプションで仕様することができます。    

``rapidadvance``要素を``input``タグにつけることでオートコンプリートを使用することを決定します。  
``rapidadvance-items``要素に指定された配列を検索のソースとします。配列は後述する``item``の配列でなくてはなりません。  
``rapidadvance-selected``要素に指定された式が補完決定時に呼び出されます。この時,第一引数は後述の``item``にバインドされます。  
この要素を指定した場合補完決定時にmodelが更新されることはありません。  
``rapidadvance-insentive``要素に``false``を指定すると大文字と小文字を区別して検索します。  

	<!-- デフォルト --> 
	<input ng-model="temp" rapidadvance rapidadvance-items="items">
	
	<!-- 補完決定時にコールバックを実行する -->
	<input ng-model="temp" rapidadvance rapidadvance-items="items" rapidadvance-selected="selected(item)">
	
	<!-- 大文字と小文字を区別して検索する -->
	<input ng-model="temp" rapidadvance rapidadvance-items="items" rapidadvance-case-insentive="false">


``item``は以下のようなオブジェクトもしくは``String``です。  
``rapidadvance-selected``のコールバックで呼び出されるときは常にオブジェクトです。(``String``で値を渡した場合でも)  
``show``を指定しなかった場合,``show``の内容は``key``と等しくなります。  

	var item = {
		key: 'Array or String',	/*検索に使う単語を指定します。StringかArrayで指定します。*/
		show: 'Show on List',	/*リストに表示される文字列です。Stringで指定します。*/
		value: 'Any object',	/*任意のオブジェクトを登録しておくことができます。*/
		match: 'Match key'		/*これを設定する必要はありません。補完決定時に使用されたkeyが代入されます。*/
	}
	