---
title: 网络流量加密识别
layout: post
categories: technique
---
实验室的任务，搬砖的日常......

<!--more-->

## 0x01 简单介绍
本来准备每个月好歹写一篇有那么一点点意义的博客，可是由于自己实在太懒了，搞得更新得实在很慢。

这篇博客没有打算写什么内容，主要内容都在下面放的链接里面了，网络流量加密识别这个比较简单的任务是实验室的师兄某个项目里面的一个需求，然后就交给我这个很菜的菜鸟来做了。

所谓的网络流量加密识别就是识别一段数据流是否加密，而是否加密的判断依据就是我们所要识别的数据流的信息熵是否在某个区间内，如果在这个区间内的话，那么我们就认为有多大可能是加密的，如果不在的话我们就认为该数据流没有加密。
<br><br>

## 0x02 代码
因为我先是用Python来写的，后来师兄说代码要用C++来实现，所以这里给出两个版本。

Python版本里面的是对txt文件里面的数据进行识别，注意这里的数据格式要严格按照我提供的数据格式来，否则需要修改代码里面的数据读取方式。数据来自于我用wireshark进行抓包的数据，是16进制的形式，这个在数据处理那里要注意一下，整个实现的原理参考云盘里的资料。

```python 
# 产生随机的数据流(也就是标准的对照组)
def generateDatastream(n, N):
	entropy = []
	for i in range(n):
		data_stream = []	#每次清空这个数据流，重新生成 
		for j in range(N):
			F = random.randint(0, 256)
			data_stream.append(F)
		d = collections.Counter(data_stream) #得到一个数据流中每个字节出现的次数
		H = 0
		#计算一个数据流的字节熵
		for k in d:
			m = (d[k] / N) * math.log(d[k] / N, 2)
			H = H + m
		H = -H
		entropy.append(H)

		
	mean_value = sum(entropy) / n 		#计算均值
	standard_deviation = np.std(entropy)#计算标准差

	#下面计算置信区间以及置信度
	for y in list(range(1,6)):
		satisfy = 0
		for en in entropy:
			low = mean_value - y * standard_deviation
			up = mean_value + y * standard_deviation

			if low <= en <= up:
				satisfy = satisfy + 1

		confidence_level = satisfy / n * 100

		if y == 4:
			low1 = low
			up1 = up
			confidence_level_1 = confidence_level

	return low1, up1, confidence_level_1

# 识别待检测的数据流，这里传入合适的置信区间
def recognizeDatastream(filename, N, low, up, confidence_level):
	fr = open(filename, 'r')
	arrayLines = fr.readlines()
	numLines = len(arrayLines)

	data_stream = []
	for line in arrayLines:
	    line = line.strip()
	    line_1 = line.split('|')
	    l = len(line_1)
	    for i in list(range(l)):
	        data_stream.append(line_1[i])

	data = []        
	for k in list(range(N)):
	    data_stream[k] = int(data_stream[k], 16)
	    data.append(data_stream[k])

	d = collections.Counter(data)

	H = 0
	for k in d:
	    m = (d[k] / N) * math.log(d[k] / N, 2)
	    H = H + m   

	H = -H
	print '待检测数据流的字节熵为: ' + str(H)

	if low <= H <= up:
		print '该数据流是加密的,置信度为:' + str(confidence_level) + '%'
	else:
		print '该数据流没有加密'
```
<br>
C++版本1.0跟上面用Python实现的效果一样，也是对txt文件里面的数据进行加密识别，在这里就不贴代码了，贴一下C++1.0版本的代码，这里唯一的区别就是对于数据的读取有区别，2.0是直接读取整个文件，把文件当成数据流来读取，然后进行加密识别。

```c++
class Tools{
public:
	int string_to_hex(string& str) //transfer string to hex-string  
	{    
	    int tmp = 0;  
	    for(int i = 0;i < str.size();i++)  
	    {  
	        if(str[i] >= '0' && str[i] <= '9')
	        	tmp = tmp * 16 + str[i] - '0';
	        else if(str[i] >= 'a' && str[i] <= 'f')
	        	tmp = tmp * 16 + str[i] - 'a' + 10;
	        else if(str[i] >= 'A' && str[i] <= 'F')
	        	tmp = tmp * 16 + str[i] - 'A' + 10;  
	    }  
	    return tmp;  
	}  

	vector<string> splitEx(const string& src, string separate_character)
	{
	    vector<string> strs;
	    
	    int separate_characterLen = separate_character.size();//分割字符串的长度,这样就可以支持如“,,”多字符串的分隔符
	    int lastPosition = 0,index = -1;
	    while (-1 != (index = src.find(separate_character,lastPosition)))
	    {
	        strs.push_back(src.substr(lastPosition,index - lastPosition));
	        lastPosition = index + separate_characterLen;
	    }
	    string lastString = src.substr(lastPosition);//截取最后一个分隔符后的内容
	    if (!lastString.empty())
	        strs.push_back(lastString);//如果最后一个分隔符后还有内容就入队
	    return strs;
	}
};

class Recognize{
public:
	vector<double> result;
	//static double *result;
	Tools tl;
public:
	Recognize(int n, int N){//n为生成数据流的个数，N为生成数据流的长度
		vector<double> entropy;
		for(int i = 0; i < n; i++){
			int *data_stream = new int[N];
			map<int, int> d;
			for(int j = 0; j < N; j++){
				int F = rand() % 255;
				data_stream[j] = F;
				d[F]++;
			}
			map<int,int>::iterator it;
			it = d.begin();
			double H = 0;
			double m;
			while(it != d.end()){
				m = (double(it->second) / double(N)) * (log(double(it->second) / double(N)) / double(log(2)));
				H = H + m;
				it++;
			}
			H = -H;
			entropy.push_back(H);
		}

		double sum = accumulate(begin(entropy), end(entropy), 0.0); 
		double mean_value =  sum / entropy.size(); //均值  
		//这里的标准差最后除以的数据是(size-1)
  		double accum  = 0.0;  
  		//计算标准差
  		for(int k = 0; k < n; k++){
  			accum += pow(entropy[k] - mean_value,2);
  		}
  		double standard_deviation = pow(accum / (entropy.size()-1), 0.5);

  		//下面计算置信区间和置信度,这里标准差的倍数我们取4
  		for(int y = 1; y < 6; y++){
  			double satisfy = 0.0;
  			double low = mean_value - double(y) * standard_deviation;
  			double up = mean_value + double(y) * standard_deviation;
  			for(int num = 0; num < entropy.size(); num++){
  				//为了避免截断误差，这样比较大小
  				if(entropy[num] - low >= 1e-10 && up - entropy[num] >= 1e-10){
  					satisfy += 1;
  				}
  			}
  			double confidence_level = satisfy / double(entropy.size()) * double(100);

  			//打印不同置信度的置信区间
  			cout << "置信区间为: [" << low << "," << up << "]" << endl;
  			cout << "置信度为: " << confidence_level << "%" << endl;
  			cout << "-------------------------" << endl;
  			if(y == 4){
  				result.push_back(low);
  				result.push_back(up);
  				result.push_back(confidence_level);
  			}
  		}
	}
	void recognizeDatastream(string filename, int N){
		double low = result[0];
		double up = result[1];
		double confidence_level_1 = result[2];
		ifstream fr;
		fr.open(filename);
		string line;
		if(fr){
			getline(fr, line);
		}else{
			cout << "no such file" << endl;
		}

		vector<string> dd = tl.splitEx(line, " ");

		int *data_stream = new int[N];
		map<int, int> d;
		for(int i = 0; i < N; i++){
			int F = tl.string_to_hex(dd[i]);
			data_stream[i] = F;
			d[F]++;
		}
		
		map<int,int>::iterator it;
		it = d.begin();
		double H = 0;
		double m;
		while(it != d.end()){
			m = (double(it->second) / double(N)) * (log(double(it->second) / double(N)) / double(log(2)));
			//cout << m << endl;
			H = H + m;
			it++;
		}
		H = -H;
		cout << "待检测的数据流的字节熵为:" << H << endl;
		if(H >= low && H <= up){
			cout << "该数据流是加密的,置信度为:" << confidence_level_1 << "%" << endl;
		}else{
			cout << "该数据流没有加密." << endl;
		}
	}
};

int main(){
	int n;
	int N;
	string filename;
	cout << "请输入要生成的随机数据流的个数(n): ";
	cin >> n;
	cout << "请输入要生成的每条数据流的长度(N>=256): ";
	cin >> N;
	cout << "输入当前目录下要识别的加密数据流文件(filename): ";
	cin >> filename;
	cout << endl;
	Recognize rc(n, N);
	rc.recognizeDatastream(filename, N);
	return 0;
}
```

### 后续...（5.28）
后续就是：加密的代码还要自己写，项目里面不是识别我测试的数据，识别的是二进制数据流，所以下面还要实现两个功能。
- 加密算法
- 16进制转2进制

1.加密算法我就直接从网上找然后改别人的，一共写了3种加密算法分别是DES，3DES，AES。开始写完的时候没有注意到密钥的问题，每次使用同一个密钥对数据进行加密，导致如果待检测二进制数据全为0的话，加密效果十分不好，随机性太弱。后来改进加密算法，因为这三个加密算法是对块进行加密的，那么我就将每一次对当前块的加密结果作为下一次的密钥，这样使得每次对块加密使用的密钥都不一样了，最终的加密效果就相当不错了，随机性很强。

2.16进制转2进制，这个就很基础了，没啥可说的，代码写得很暴力，就不贴了。
<br><br>

## 0x03 资源
[文件地址(百度网盘)](https://pan.baidu.com/s/1tgSxdHLcROE-M5yEKY9MKw)
提取码：ajis