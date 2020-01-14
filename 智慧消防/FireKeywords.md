- Fire behavior calculations
- simulating fire growth for constant conditions using a minimum travel time
  (MTT Minimum Travel Time) algorithm
- Time Series
- Surveillance
-  **基于BIM构建应急预案** 

- AFRD's criteria for inspection `The Atlanta Fire Rescue Department`[AFRD]

- fire load[火灾载荷]

-  Fire hazard assessment

  - the most probable fire scenarios
  - prediction of the rate of fire growth
  - the amount of fuel present
  - its impact on the occupants and their ability to escape safely

- ISO 135713 subdivides the hazards to people escaping from a fire into the effects of

  - heat
  - asphyxiant gas 窒息性气体
  - irritant gases 刺激性气体
  - visual obscuration by smoke 烟雾对视觉的遮蔽
  - 将四个组成部分分别对待，当四个中的其中一个达到了阻止潜在受害者逃脱的水平时，将其定义为 untenability (不可维持)

  <img src="FireKeywords.assets/image-20191225121920386.png" alt="image-20191225121920386" style="zoom:50%;" />

  

- Fire Toxicity

- The stages of fire growth
- sample data 
  - In pattern matching studies, sample data are needed to train the classifier.

- Surface-Area-to-Volume Ratio
  -   Surface-Area-to-Volume Ratio – The ratio of the surface area of a fuel particle (in square-ft) to
its volume (in cubic-ft). The “finer” the fuel particle, the higher the ratio; for example, for grass
this ratio ranges above 2,000; while for a ½ inch diameter stick it is 109.

- Rothermel火灾蔓延模型(林火蔓延模型)
- Fuel  Type
  - NFDRS选取了具有代表性的 20个可燃物类型（表 1），每个类型都有一套相应的物理参数，包括可燃物表面积体积比、可燃物载量、可燃物床层高度、熄灭含水率、发热量等，从而建立
20个可燃物模型，为火蔓延模型提供火行为参数。
- ![20191227092035.png](https://i.loli.net/2019/12/27/Wc97KtSeyQNILEh.png)


- 火灾设计
  ![](https://upload-images.jianshu.io/upload_images/20287653-ec7eff9eeaa08313.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  火灾依次经历了阴燃阶段、增长阶段、充分发展阶段、衰退阶段直至最终熄灭。
  **对火灾各个时期热释放速率的变化情况进行设定, 这一过程称为设计火灾。**

  在设计火灾时, 通常**忽略火灾的阴燃阶段及衰退阶段**, 而主要考虑火灾的**增长阶段和充分发展阶段**;因为这两个阶段**最能够反映火灾的特征及危险性**, 其中
  - 增长阶段反映了火灾发展的快慢程度
  - 充分发展阶段则反映了火灾可能达到的最大规模

- 火灾的蔓延

    火灾在初期仅有少量的可燃物参与燃烧, 之后通过**热辐
射**将**相邻区域内的可燃物引燃**, 再经过一段时间后, 被引燃的
可燃物产生的热辐射又将邻近的可燃物引燃。
- 火灾增长阶段之T平方火灾模型
  >T 平方火灾是非稳态火灾之一。该模型假定火灾热释放
速率与时间的平方成正比。
$Q = \alpha t^2$，其中$\alpha$为火灾增长系数,$kW/s^2$;t为火灾发展时间，s。
    >根据火灾热释放速率达到1055 kW 的时间, 又将T 平
方特征火灾分为慢速火、中速火、快速火和超快火

- 火灾充分发展阶段
  >T 平方特征火灾实际描述的是火灾的增长阶段。那么如何确定火灾何时达到它的充分发展阶段呢?
或者说火灾在充分发展阶段的热释放速率能达到多大规模?

    1.火灾为无限制地自由发展状态
    >这种状态也可以认为是自动灭火系
统失效的情况。
    
    2.火灾受灭火系统的控制
    >灭火系统动作并有效作用的情况下, 火灾将受到抑制, 热
释放速率不再继续增长, 继而会呈下降趋势。但在消防安全工程学中, 为安全起见, 通常保守地假定灭火系统动作后热释放速率不再增长, 并且继续维持在这一水平。火灾的最大热释放速率可以按灭火系统动作时的热释放
速率考虑。
![](https://upload-images.jianshu.io/upload_images/20287653-c7a4cafb17f2db37.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 通风井（地下建筑的）

    为了保证安全，在工程设计中，根据需要设置通风和排气通道。通风井就是排气设施中的一种。
    
    参考资料：百度百科

- 通风管道
  
    通风管道是工业与民用建筑的通风与空调工程用金属或复合管道，是为了使空气流通，降低有害气体浓度的一种市政基础设施

    参考资料：建设部关于发布行业标准《通风管道技术规程》的公告 ．国家建设部

    