SpringBoot

- SpringBoot是对Spring的再封装，只需少量入口不需要大量配置就可与整个Spring技术栈交互。**J2EE一站式解决方案**
- **SpringCloud：分布式整体解决方案**
## 优点
- 快速创建独立运行的Spring项目以及与主流框架的集成
  - 以前spring要和其他框架集成要写一大堆配置文件
- 使用嵌入式的Servlet容器，应用无需打成war包
  - 如果开发web应用的话无需先装tomcat再将应用打成war包放在服务器上。
  - 直接打成jar包，使用内置的tomcat，通过java -jar的方式启动
- starters（启动器）自动依赖与版本控制
- 大量的自动配置，简化开发，也可修改默认值
- 无需配置XML，无代码生成，开箱即用
- 准生产环境的运行时应用监控（运维监控）
- 与云计算的天然集成

## 微服务
微服务是一种架构风格。

一个应用应该是一组小型服务。服务间可以通过HTTP的方式进行互通。

每一个功能元素最终都是一个可独立替换和独立升级的软件单元。（分布式的功能单元使用springCloud）

## SpringBoot部署

```xml
<!--这个插件可以将应用打包成一个可执行jar包，直接使用java -jar 命令进行执行-->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

### Maven打包方式

双击maven-》Lifecycle-〉package就可以打包至target目录

![Screen Shot 2020-04-27 at 12.16.05 AM](/Volumes/MAC文件/MyLearning/java/框架/images/Screen Shot 2020-04-27 at 12.16.05 AM.png)

## Pom文件

### 父项目

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.2.6.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>

spring-boot-starter-parent的父项目是spring-boot-dependencies
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>2.2.6.RELEASE</version>
    <relativePath>../../spring-boot-dependencies</relativePath>
  </parent>
```

spring-boot-dependencies来真正管理springboot应用里面的所有依赖版本；（Spring Boot的版本仲裁中心）

以后我们导入依赖的时候是不需要写版本的。springBoot已经把依赖给打包好了。

但是对于那些没有在dependencies里面管理的依赖还是需要写版本号的。

```xml
<properties>
  <activemq.version>5.15.12</activemq.version>
  <antlr2.version>2.7.7</antlr2.version>
  <appengine-sdk.version>1.9.79</appengine-sdk.version>
  <artemis.version>2.10.1</artemis.version>
  <aspectj.version>1.9.5</aspectj.version>
  <assertj.version>3.13.2</assertj.version>
  <atomikos.version>4.0.6</atomikos.version>
  <awaitility.version>4.0.2</awaitility.version>
  <bitronix.version>2.1.4</bitronix.version>
  <build-helper-maven-plugin.version>3.0.0</build-helper-maven-plugin.version>
  <byte-buddy.version>1.10.8</byte-buddy.version>
  <caffeine.version>2.8.1</caffeine.version>
  <cassandra-driver.version>3.7.2</cassandra-driver.version>
  <classmate.version>1.5.1</classmate.version>
  <commons-codec.version>1.13</commons-codec.version>
  <commons-dbcp2.version>2.7.0</commons-dbcp2.version>
  <commons-lang3.version>3.9</commons-lang3.version>
  <commons-pool.version>1.6</commons-pool.version>
  <commons-pool2.version>2.7.0</commons-pool2.version>
  <couchbase-cache-client.version>2.1.0</couchbase-cache-client.version>
  <couchbase-client.version>2.7.13</couchbase-client.version>
  <db2-jdbc.version>11.5.0.0</db2-jdbc.version>
  <dependency-management-plugin.version>1.0.9.RELEASE</dependency-management-plugin.version>
  <derby.version>10.14.2.0</derby.version>
  <dropwizard-metrics.version>4.1.5</dropwizard-metrics.version>
  <ehcache.version>2.10.6</ehcache.version>
  <ehcache3.version>3.8.1</ehcache3.version>
  <elasticsearch.version>6.8.7</elasticsearch.version>
  <embedded-mongo.version>2.2.0</embedded-mongo.version>
  <exec-maven-plugin.version>1.6.0</exec-maven-plugin.version>
  <flatten-maven-plugin.version>1.1.0</flatten-maven-plugin.version>
  <flyway.version>6.0.8</flyway.version>
  <freemarker.version>2.3.30</freemarker.version>
  <git-commit-id-plugin.version>3.0.1</git-commit-id-plugin.version>
  <glassfish-el.version>3.0.3</glassfish-el.version>
  <glassfish-jaxb.version>2.3.2</glassfish-jaxb.version>
  <groovy.version>2.5.10</groovy.version>
  <gson.version>2.8.6</gson.version>
  <h2.version>1.4.200</h2.version>
  <hamcrest.version>2.1</hamcrest.version>
  <hazelcast.version>3.12.6</hazelcast.version>
  <hazelcast-hibernate5.version>1.3.2</hazelcast-hibernate5.version>
  <hibernate.version>5.4.12.Final</hibernate.version>
  <hibernate-validator.version>6.0.18.Final</hibernate-validator.version>
  <hikaricp.version>3.4.2</hikaricp.version>
  <hsqldb.version>2.5.0</hsqldb.version>
  <htmlunit.version>2.36.0</htmlunit.version>
  <httpasyncclient.version>4.1.4</httpasyncclient.version>
  <httpclient.version>4.5.12</httpclient.version>
  <httpcore.version>4.4.13</httpcore.version>
  <infinispan.version>9.4.18.Final</infinispan.version>
  <influxdb-java.version>2.15</influxdb-java.version>
  <jackson.version>2.10.3</jackson.version>
  <jackson-bom.version>${jackson.version}</jackson-bom.version>
  <jakarta-activation.version>1.2.2</jakarta-activation.version>
  <jakarta-annotation.version>1.3.5</jakarta-annotation.version>
  <jakarta-jms.version>2.0.3</jakarta-jms.version>
  <jakarta-json.version>1.1.6</jakarta-json.version>
  <jakarta-json-bind.version>1.0.2</jakarta-json-bind.version>
  <jakarta-mail.version>1.6.5</jakarta-mail.version>
  <jakarta-persistence.version>2.2.3</jakarta-persistence.version>
  <jakarta-servlet.version>4.0.3</jakarta-servlet.version>
  <jakarta-servlet-jsp.version>2.3.5</jakarta-servlet-jsp.version>
  <jakarta-servlet-jsp-jstl.version>1.2.7</jakarta-servlet-jsp-jstl.version>
  <jakarta-transaction.version>1.3.3</jakarta-transaction.version>
  <jakarta-validation.version>2.0.2</jakarta-validation.version>
  <jakarta-websocket.version>1.1.2</jakarta-websocket.version>
  <jakarta-ws-rs.version>2.1.6</jakarta-ws-rs.version>
  <jakarta-xml-bind.version>2.3.3</jakarta-xml-bind.version>
  <jakarta-xml-soap.version>1.4.2</jakarta-xml-soap.version>
  <jakarta-xml-ws.version>2.3.3</jakarta-xml-ws.version>
  <janino.version>3.1.2</janino.version>
  <javax-activation.version>1.2.0</javax-activation.version>
  <javax-annotation.version>1.3.2</javax-annotation.version>
  <javax-cache.version>1.1.1</javax-cache.version>
  <javax-jaxb.version>2.3.1</javax-jaxb.version>
  <javax-jaxws.version>2.3.1</javax-jaxws.version>
  <javax-jms.version>2.0.1</javax-jms.version>
  <javax-json.version>1.1.4</javax-json.version>
  <javax-jsonb.version>1.0</javax-jsonb.version>
  <javax-mail.version>1.6.2</javax-mail.version>
  <javax-money.version>1.0.3</javax-money.version>
  <javax-persistence.version>2.2</javax-persistence.version>
  <javax-transaction.version>1.3</javax-transaction.version>
  <javax-validation.version>2.0.1.Final</javax-validation.version>
  <javax-websocket.version>1.1</javax-websocket.version>
  <jaxen.version>1.2.0</jaxen.version>
  <jaybird.version>3.0.8</jaybird.version>
  <jboss-logging.version>3.4.1.Final</jboss-logging.version>
  <jboss-transaction-spi.version>7.6.0.Final</jboss-transaction-spi.version>
  <jdom2.version>2.0.6</jdom2.version>
  <jedis.version>3.1.0</jedis.version>
  <jersey.version>2.29.1</jersey.version>
  <jest.version>6.3.1</jest.version>
  <jetty.version>9.4.27.v20200227</jetty.version>
  <jetty-el.version>8.5.49</jetty-el.version>
  <jetty-jsp.version>2.2.0.v201112011158</jetty-jsp.version>
  <jetty-reactive-httpclient.version>1.0.3</jetty-reactive-httpclient.version>
  <jmustache.version>1.15</jmustache.version>
  <jna.version>4.5.2</jna.version>
  <joda-time.version>2.10.5</joda-time.version>
  <johnzon.version>${johnzon-jsonb.version}</johnzon.version>
  <johnzon-jsonb.version>1.2.3</johnzon-jsonb.version>
  <jolokia.version>1.6.2</jolokia.version>
  <jooq.version>3.12.4</jooq.version>
  <jsonassert.version>1.5.0</jsonassert.version>
  <json-path.version>2.4.0</json-path.version>
  <jstl.version>1.2</jstl.version>
  <jtds.version>1.3.1</jtds.version>
  <junit.version>4.12</junit.version>
  <junit-jupiter.version>5.5.2</junit-jupiter.version>
  <kafka.version>2.3.1</kafka.version>
  <kotlin.version>1.3.71</kotlin.version>
  <kotlin-coroutines.version>1.3.5</kotlin-coroutines.version>
  <lettuce.version>5.2.2.RELEASE</lettuce.version>
  <liquibase.version>3.8.8</liquibase.version>
  <log4j2.version>2.12.1</log4j2.version>
  <logback.version>1.2.3</logback.version>
  <lombok.version>1.18.12</lombok.version>
  <mariadb.version>2.4.4</mariadb.version>
  <maven-antrun-plugin.version>1.8</maven-antrun-plugin.version>
  <maven-assembly-plugin.version>3.1.1</maven-assembly-plugin.version>
  <maven-clean-plugin.version>3.1.0</maven-clean-plugin.version>
  <maven-compiler-plugin.version>3.8.1</maven-compiler-plugin.version>
  <maven-dependency-plugin.version>3.1.2</maven-dependency-plugin.version>
  <maven-deploy-plugin.version>2.8.2</maven-deploy-plugin.version>
  <maven-enforcer-plugin.version>3.0.0-M3</maven-enforcer-plugin.version>
  <maven-failsafe-plugin.version>2.22.2</maven-failsafe-plugin.version>
  <maven-help-plugin.version>3.2.0</maven-help-plugin.version>
  <maven-install-plugin.version>2.5.2</maven-install-plugin.version>
  <maven-invoker-plugin.version>3.2.1</maven-invoker-plugin.version>
  <maven-jar-plugin.version>3.1.2</maven-jar-plugin.version>
  <maven-javadoc-plugin.version>3.1.1</maven-javadoc-plugin.version>
  <maven-resources-plugin.version>3.1.0</maven-resources-plugin.version>
  <maven-shade-plugin.version>3.2.2</maven-shade-plugin.version>
  <maven-site-plugin.version>3.8.2</maven-site-plugin.version>
  <maven-source-plugin.version>3.1.0</maven-source-plugin.version>
  <maven-surefire-plugin.version>2.22.2</maven-surefire-plugin.version>
  <maven-war-plugin.version>3.2.3</maven-war-plugin.version>
  <micrometer.version>1.3.6</micrometer.version>
  <mimepull.version>1.9.13</mimepull.version>
  <mockito.version>3.1.0</mockito.version>
  <mongodb.version>3.11.2</mongodb.version>
  <mongo-driver-reactivestreams.version>1.12.0</mongo-driver-reactivestreams.version>
  <mssql-jdbc.version>7.4.1.jre8</mssql-jdbc.version>
  <mysql.version>8.0.19</mysql.version>
  <nekohtml.version>1.9.22</nekohtml.version>
  <neo4j-ogm.version>3.2.10</neo4j-ogm.version>
  <netty.version>4.1.48.Final</netty.version>
  <netty-tcnative.version>2.0.30.Final</netty-tcnative.version>
  <nio-multipart-parser.version>1.1.0</nio-multipart-parser.version>
  <ojdbc.version>19.3.0.0</ojdbc.version>
  <okhttp3.version>3.14.7</okhttp3.version>
  <pooled-jms.version>1.0.6</pooled-jms.version>
  <postgresql.version>42.2.11</postgresql.version>
  <prometheus-pushgateway.version>0.7.0</prometheus-pushgateway.version>
  <quartz.version>2.3.2</quartz.version>
  <querydsl.version>4.2.2</querydsl.version>
  <rabbit-amqp-client.version>5.7.3</rabbit-amqp-client.version>
  <reactive-streams.version>1.0.3</reactive-streams.version>
  <reactor-bom.version>Dysprosium-SR6</reactor-bom.version>
  <rest-assured.version>3.3.0</rest-assured.version>
  <rsocket.version>1.0.0-RC6</rsocket.version>
  <rxjava.version>1.3.8</rxjava.version>
  <rxjava2.version>2.2.19</rxjava2.version>
  <rxjava-adapter.version>1.2.1</rxjava-adapter.version>
  <saaj-impl.version>1.5.1</saaj-impl.version>
  <selenium.version>3.141.59</selenium.version>
  <selenium-htmlunit.version>2.36.0</selenium-htmlunit.version>
  <sendgrid.version>4.4.6</sendgrid.version>
  <servlet-api.version>4.0.1</servlet-api.version>
  <slf4j.version>1.7.30</slf4j.version>
  <snakeyaml.version>1.25</snakeyaml.version>
  <solr.version>8.2.0</solr.version>
  <spring-amqp.version>2.2.5.RELEASE</spring-amqp.version>
  <spring-batch.version>4.2.1.RELEASE</spring-batch.version>
  <spring-cloud-connectors.version>2.0.7.RELEASE</spring-cloud-connectors.version>
  <spring-data-releasetrain.version>Moore-SR6</spring-data-releasetrain.version>
  <spring-framework.version>5.2.5.RELEASE</spring-framework.version>
  <spring-hateoas.version>1.0.4.RELEASE</spring-hateoas.version>
  <spring-integration.version>5.2.5.RELEASE</spring-integration.version>
  <spring-kafka.version>2.3.7.RELEASE</spring-kafka.version>
  <spring-ldap.version>2.3.2.RELEASE</spring-ldap.version>
  <spring-restdocs.version>2.0.4.RELEASE</spring-restdocs.version>
  <spring-retry.version>1.2.5.RELEASE</spring-retry.version>
  <spring-security.version>5.2.2.RELEASE</spring-security.version>
  <spring-session-bom.version>Corn-SR2</spring-session-bom.version>
  <spring-ws.version>3.0.8.RELEASE</spring-ws.version>
  <sqlite-jdbc.version>3.28.0</sqlite-jdbc.version>
  <sun-mail.version>${jakarta-mail.version}</sun-mail.version>
  <thymeleaf.version>3.0.11.RELEASE</thymeleaf.version>
  <thymeleaf-extras-data-attribute.version>2.0.1</thymeleaf-extras-data-attribute.version>
  <thymeleaf-extras-java8time.version>3.0.4.RELEASE</thymeleaf-extras-java8time.version>
  <thymeleaf-extras-springsecurity.version>3.0.4.RELEASE</thymeleaf-extras-springsecurity.version>
  <thymeleaf-layout-dialect.version>2.4.1</thymeleaf-layout-dialect.version>
  <tomcat.version>9.0.33</tomcat.version>
  <unboundid-ldapsdk.version>4.0.14</unboundid-ldapsdk.version>
  <undertow.version>2.0.30.Final</undertow.version>
  <versions-maven-plugin.version>2.7</versions-maven-plugin.version>
  <webjars-hal-browser.version>3325375</webjars-hal-browser.version>
  <webjars-locator-core.version>0.41</webjars-locator-core.version>
  <wsdl4j.version>1.6.3</wsdl4j.version>
  <xml-maven-plugin.version>1.0.2</xml-maven-plugin.version>
  <xmlunit2.version>2.6.4</xmlunit2.version>
</properties>
```

### 导入的依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

spring-boot-starter-web:【SpringBoot的Web场景启动器】

- starters是一系列依赖描述的组合

- spring-boot-starter：SpringBoot的场景启动器；帮我们导入了Web模块正常运行所依赖的组件。

### Starers启动器

SpringBoot将所有功能场景都抽取出来，做成一个个starers（启动器），只需要在项目里面引入这些starer，相关场景的所有依赖都会导入进来。要用什么功能就导入什么场景启动器。 

starters网址：https://docs.spring.io/spring-boot/docs/2.2.6.RELEASE/reference/html/using-spring-boot.html#using-boot-starter

## 主程序类/主入口类

```java
package com.wwl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
/*
* 标注一个主程序类，说明这是一个spring boot应用
* */
@SpringBootApplication
public class HelloworldMainApplication {

    public static void main(String[] args) {
//        spring应用启动起来
        SpringApplication.run(HelloworldMainApplication.class, args);
    }

}
```

### @SpringBootApplication

说明这个类是SpringBoot的**主配置类**，SpringBoot就应该运行这个类的main方法来启动SpringBoot应用

spring也有主配置文件

```Java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
      @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
```

- @SpringBootConfiguration（表明是SpringBoot的配置文件）

- @EnableAutoConfiguration：开启自动配置功能 

  - @AutoConfigurationPackage：自动配置包
- @Import：给容器导入配置类，导入的配置类可以不加@Configuration
    - @Import(AutoConfigurationPackages.Registrar.class)：**将主配置类的所在包及下面所有子包里的所有组件扫描到SpringBoot里**。
  - @Import(AutoConfigurationImportSelector.class)：导入哪些组件的选择器；
    - 将所有需要导入的组件以全类名的方式返回，这些组件就会被添加到容器中
    - 会给容器中导入非常多的自动配置类（XXXAutoConfiguration）；给容器中导入这个场景所需要的所有组件，并配置好这些组件
    - 有了自动配置类，免去了我们手动编写配置注入功能组件等的工作。


  ```java
  @AutoConfigurationPackage
  @Import(AutoConfigurationImportSelector.class)
  public @interface EnableAutoConfiguration {
  ```

J2EE的整体整合解决方案和自动配置都在spring-boot-autoconfigure-1.5.9.RELEASE.jar里。

## 使用Spring Initializer快速创建SpringBoot项目

- 选择自己需要的模块(启动器)；想到会联网创建SpringBoot项目
- 默认的SpringBoot项目：
  - 主程序已经生成好了，我们只需要业务逻辑
  - resources文件夹的目录结构
    - static：保存静态资源(js css image等)
    - templates：保存所有的模版页面；(因为SpringBoot默认jar包使用的是**嵌入式的Tomcat，是不支持jsp页面**的)；但是可以使用模版引擎(freemaker、thymeleaf)。
    - application.properties:SpringBoot应用的默认配置文件；可以修改一些默认设置
      - server.port=8081；tomcat就会运行在8081端口

## SpringBoot的全局配置文件

配置文件名是固定的。

- application.properties
- application.yml

**配置文件的作用：修改SpringBoot自动配置的默认值**

ymal：以数据为中心，比json、xml更适合做配置文件

### Yaml基本语法

```yaml
server:
  port: 8081
```

- 使用缩进表示层级关系
- 缩进时不允许使用Tab键，只允许空格
- 缩进的空格数目不重要，只要相同层级的元素左对齐即可
- 大小写敏感

### Yaml支持的三种数据结构

- 对象：值键值对的集合（属性和值）

  ```yaml
  friends:
    lastName: zhangsan
    age: 20
  ```

  - 行内写法（对象元素键值对是有层级关系的，所以键后面要加空格）

  ```yaml
  friends: {lastName: zhangsan,age: 18}
  ```

  

- 数组：一组按次序排列的值（List、set ）

  - 使用短横线 - 表示数组中的一个元素

```yaml
pets:
 - cat
 - dog
 - pig
```

  - 行内写法(数组里的元素是没有层级关系的，所以没有空格)

    ```yaml
    pets: [cat,dog,pig]
    ```

    

- 字面量：单个的、不可再分的值(数字、字符串、布尔)
  - k: v: 字面直接来写
  - 字符串默认不用加上单引号或者双引号
  - 双引号：不会转移字符里面的特殊字符；特殊字符会作为本身想表达的意思输出 \n 输出换行
  - 单引号：会转义特殊字符，特殊字符最终只是一个普通的字符串数据。\n 输出 \n

### 配置文件处理器
```xml
<!--        配置文件处理器，配置文件进行绑定就会有提示-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
        </dependency>
```

### 配置文件值注入

两种注入方式默认都是从默认的配置文件中获取值的

#### @ConfigurationProperties(prefix = "person") 

```yaml
person:
  lastName: hello
  age: 18
  boss: false
  maps: {k1: v1,k2: v2}
  lists: [lisi,zhaoliu]
  birthday: 2017/12/12
  dog:
    name: 小狗
    age: 12
```

```java
@Component
// 将配置文件中配置的每一个属性的值，映射到这个组件中
// 将本类中所有的properties与配置文件中的properties进行绑定，两者的名字一定要是一样的才能绑定，不然就是空
// prefix = "person" 配置文件中哪个property（根元素）下面的属性进行一一映射。
@ConfigurationProperties(prefix = "person")
public class Person {
    private String lastName;
    private Integer age;
    private Boolean boss;
    private Date birthday;

    private Map<String,Object> maps;
    private List<Object> lists;
    private Dog dog;}
```

```xml
<!--        配置文件处理器，配置文件进行绑定就会有提示-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
        </dependency>
```

#### @Value
```java
    @Value("${person.lastName}")
    private String lastName;
    @Value("${person.age}")
    private Integer age;
    @Value("${person.boss}")
    private Boolean boss;
    @Value("${person.birthday}")
    private Date birthday;
```
#### 比较

|                               | @ConfigurationProperties | @Value     |
| ----------------------------- | ------------------------ | ---------- |
| 功能                          | 批量注入配置文件中的属性 | 一个个指定 |
| 松散绑定（松散语法）          | 支持                     | 不支持     |
| SpEL                          | 不支持                   | 支持       |
| JSR303数据校验（@Validation） | 支持                     | 不支持     |
| 复杂数据封装（maps、lists）   | 支持                     | 不支持     |

如果只是想获取配置文件中的某项值，使用@Value

如果我们专门写了一个javaBean来和配置文件映射：使用@ConfigurationProperties

### @PropertySource和@ImportResource

- @PropertySource：使用classpath从resource目录加载指定的配置文件

  - 有时候我们的配置文件不全都写在主配置文件，这时候就可以使用该注解加载指定的配置文件

  - 可以在主配置类里加，这样其他的配置文件就可以找到此配置文件

  - ```
    @PropertySource(value = "classpath:person.properties")
    ```

- @ImportResource：导入Spring的配置文件，让配置文件里面的内容生效

  - 导入的是老的spring里用xml配置的配置文件

  - 在主配置类中加入

  - ```
    //ImportResource从配置文件中注入bean对象，Springboot官方不推荐，推荐如下方式注入对象
    //springboot项目使用@Configuration注解的方式注入bean
    //@ImportResource("classpath:dbAnnotation.xml")
    ```

### 配置文件占位符

1. 随机数

   ```
   ${random.value} ${random.int} ${random.long} 
   ```

   

2. 占位符获取之前配置的值，如果没有，使用冒号：指定默认值

```yaml
person:
  lastName: 张三${random.uuid}
  age: ${random.int}
  boss: false
  maps: {k1: v1,k2: v2}
  lists: [lisi,zhaoliu]
  birthday: 2017/12/12
  dog:
    name: ${person.hello:hello}小狗
    age: 12
```

### Profile

**多profile文件**

- properties配置文件配置多profile：
  - 我们在主配置文件编写的时候，文件名可以是application-{profile}.properties
  - 默认使用application.properties配置文件

- yaml配置文件配置多profile（使用多文档块方式）

**激活profile**

- properties配置文件(spring.profiles.active=dev)
- yaml配置文件
- 命令行指定
  - java -jar XXX.jar --spring.profiles.active=dev(会覆盖配置文件配置的profile)
- 虚拟机参数
  - -Dspring.profiles.active=dev

```
server:
  port: 8081
spring:
  profiles:
    active: dev
---
server:
  port: 8083
spring:
  profiles: dev
---
server:
  port: 8084
spring:
  profiles: prod
```

## SpringBoot与日志

**slf4j、log4j、logback都是一个人开发的**

日志门面（日志的抽象层）：SLF4j(Simple Logging Facade for Java)

日志实现：log4j、logback(log4j的升级版)

### 如何在系统中使用slf4j

开发的时候，日志记录方法的调用，不应该直接调用日志的实现类，而是调用日志抽象层的方法，抽象层会自己调用实现类。

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloWorld {
  public static void main(String[] args) {
    Logger logger = LoggerFactory.getLogger(HelloWorld.class);
    logger.info("Hello World");
  }
}
```

## Web开发

### SpringBoot对静态资源的映射规则

- 1.所有/webjars/**请求资源，都去classpath:/META-INF/resources/webjars/找资源

  - webjars 官网：https://www.webjars.org

  - 可以在官网找到jquery的依赖，就可以在maven中添加jquery依赖来引入了。

  - 这时候通过http://localhost:8080/webjars/jquery/3.3.1/jquery.js 来访问jquery文件

  - 如果找不到可以重新build项目再重启试试

    ![Screen Shot 2020-04-27 at 10.55.42 AM](/Volumes/MAC文件/MyLearning/java/框架/images/Screen Shot 2020-04-27 at 10.55.42 AM.png)

- 2."/**" 访问当前项目的任何静态资源（静态资源的文件夹）



- ![image-20200427111558788](/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427111558788.png)

```
  "classpath:/META-INF/resources/",
  "classpath:/resources/",
  "classpath:/static/"
  "classpath:/public/"
  "/" :当前项目的跟路径
```

  - 比如我想访问localhost:8080/abc.html ====>这个时候就会去静态资源文件夹里面找abc.html(如果是图片是找不到的)

- 3.欢迎页/首页 静态资源文件夹下的所有index.html页面会自动被 根目录 “/” 映射
  - Localhost:8080/ ====>找index页面

## 模版引擎

SpringBoot不是Web工程，打包方式是jar，不能使用jsp，要用模版引起做前端展示

jsp、Velocity、Freemaker、Thymeleaf（SpringBoot推荐模版引擎）

<img src="/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427124329588.png" alt="image-20200427124329588" style="zoom:50%;" />

Thymeleaf使用&语法

只要把HTML页面放在classpath:/template/，thymeleaf就能自动渲染

```java
    @RequestMapping("/success")
    public String success() {
//        返回 classpath:/templates/success.html
        return "success";
    }
```

1. 导入thymeleaf的名称空间，这样thymeleaf语法就有提示

```xml
   <html lang="en" xmlns:th="http://www.thymeleaf.org">
```

2. 使用thymeleaf使用

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>

<body>
<h1>成功！</h1>
<!--th:text 将div里面的文本内容设置为${},请求里传过来的值-->
<div th:text="${hello}"></div>
</body>
</html>
```

3. 语法规则
   - th:text：改变当前元素里面的文本内容
   - 使用th：xx属性 来替换任意原生 xx 属性的值 

- 表达式
  - Variable Expressions：${...} 获取变量值 OGNL表达式
  - Selection Variable Expressions：*{...}  选择表达式，和${} 在功能上是一样的
  - Message Expressions: #{...} 获取国际化内容
  - Link URL Expressions @{...}自定义URL
  - Fragment Expressions: ~{...} 片段引用表达式

## SpringData

简介：

SpringData项目的目的是为了简化构建基于 Spring 框架应用的数据访问技术，包括非关系型数据库、Map-Reduce框架、云数据服务等等；另外也包含对关系型数据库的访问支持

- SpringData包含多个子项目

  - Spring Data Commons

  - Spring Data JPA ：**JPA（Java Persistence API）：java持久化API**，用于操作关系型数据库

  - Spring Data KeyValue

  - Spring Data LDAP

  - Spring Data MongoDB

  - Spring Data Gemfire

  - Spring Data REST

  - Spring Data Redis

  - Spring Data for Apache Cassandra

  - Spring Data for Apache Solr

  - Spring Data Couchbase (Community module)

  - Spring Data Elasticsearch (Community module)

  - Spring Data Neo4j (Community module)

1.特点：

  SpringData为我们提供使用统一的API来对数据访问层进行操作。让我们在使用关系型或者非关系型数据访问技术时都基于Spring提供的统一标准，标准包含了CRUD、查询、排序和分页的相关操作

2、统一的Repository接口

Repository<T,ID extends Serializable> ：统一接口

RevisionRepository<T,ID extends Serializable,N extends Number & Comparable<N>>：基于乐观锁机制

CrudRepository<T,ID extends Serializable>：基于Crud操作

PagingAndSortingRepositoriy<T,ID extends Serializable>：基于Crud及分页

3、提供数据访问模版类 xxxTemplate；

​	如：MongoTemplate、RedisTemplate

4、JPA与Spring Data

**JPA（Java Persistence API）：java持久化API**，用于操作关系型数据库

- JpaRepository基本功能
  - 编写接口继承JpaRepository即有crud及分页等基本功能
- 定义符合规范的方法命名
  - 在借口中只需要声明符合规范的方法，即拥有对应的功能
- @Query自定义查询，定制查询SQL
- Specification查询（SpringData JPA支持JPA2.0的Criteria查询）

<img src="/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427134558231.png" alt="image-20200427134558231" style="zoom:30%;" />



## SpringBoot与消息

消息服务中两个重要概念：

**消息代理**(message broker)和 **目的地**(destination)

当消息发送着发送消息以后，将由消息代理接管，消息代理保证消息传递到指定目的地。

消息队列主要有两红形式的目的地

1. **队列（queue）**：点对点消息通信（p2p）
2. **主题（topic）**：发布（publish）/订阅（subscribe）消息通信

### 异步处理

<img src="/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427200219029.png" alt="image-20200427200219029" style="zoom:35%;" />

### 应用解耦

<img src="/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427200403975.png" alt="image-20200427200403975" style="zoom:40%;" />

### 流量销峰

<img src="/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427200454440.png" alt="image-20200427200454440" style="zoom:50%;" />

### 常见消息模式

#### 点对点式

- 消息发送着发送消息，消息代理将其**放入一个队列**中，消息接收者从队列中获取消息内容，消息读取后被移除队列（只能被一个接收者消费）
- 消息只有唯一的发送者和接受者，但不是说只能有一个接收者。（大家都可以订阅这个消息，但是一旦被处理就会被销毁，其他人就不能处理了）

#### 发布订阅式：

- 发送者（发布者）**发送消息到主题**，多个接收者（订阅者）监听（订阅）这个主题，那么就会在消息到达时同时收到消息

### 消息服务规范

#### JMS（Java Message Service） Java消息服务：

- 基于JVM消息代理的规范。ActiveMQ、HornetMQ是JMS实现

#### AMQP（Advanced Message Queueing Protocol）

- 高级消息队列协议，也是一个消息代理的规范，兼容JMS
- RabbitMQ是AMQP的实现

### RabbitMQ

**核心概念**

- Message：消息是不具名的，它由消息头和消息体组成。消息体是不透明的，而消息头是由一系列的可选属性组成，这些属性包括 routing key（路由键，指定每个消息发给谁）、priority（相对于其他消息的优先权）、delivery-mode（指出该消息可能需要持久性存储）等。

- Publisher：消息的生产者，也是一个向交换器发布消息的客户端应用程序

- **Exchange：交换器，【相当于路由转发】**交换机根据消息上的路由键，查由绑定构成的路由表，将消息转发给队列

  - 用来**接收生产者发送的消息**并将这些消息**路由给**服务器中的**队列**。Exchange有四种类型，不同类型的Exchange转发消息的策略有所区别

  - direct：默认【点对点的通信模型】

    ![image-20200427204720318](/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427204720318.png)

  - fanout（分发，广播式的）

    ![image-20200427205052290](/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427205052290.png)

  - topic

    ![image-20200427205120789](/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427205120789.png)

  - ~~headers~~

- Queue：消息队列：用来保存消息直到发送给消费者。它是消息的容器，也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。
- Binding：绑定：用于消息队列和交换器之间的关联。一个绑定就是基于路由键将交换器和消息队列连接起来的路由规则，所以可以将交换器理解成一个由绑定构成的路由表。
- Connection：网络连接，比如一个TCP连接。
- Channel：信道，多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的TCP连接内的虚拟连接，（一条TCP连接里包含了多条信道）AMQP命令都是通过信道发出去的，不管是发布消息、订阅队列还是接收消息，这些动作都是通过信道完成。因为对于操作系统来说，建立和销毁TCP是非常昂贵的开销，所以引入了信道的概念以复用一条TCP连接。
- Consumer：消费者，表示一个从消息队列中取得消息的客户端应用程序
- Virtual Host：**一台broker里可以有很多vhost，彼此之间是隔离的。每个vhost有自己的消息队列、交换机和路由规则**
  - 虚拟主机，表示一批交换器、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。每个vhost本质上就是一个 mini 版的RabbitMQ服务器，拥有自己的队列、交换机、绑定和权限机制。vhost是AMQP概念的基础，必须在连接时指定，RabbitMQ默认的vhost是 / 。
- Broker：表示消息队列服务器实体。

![image-20200427203559189](/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427203559189.png)

## 使用rabbitmq实验

1. docker下载rabbitmq

     docker pull rabbitmq:3-management

2. run 15672是浏览器访问rabbitmq管理器的端口

     docker run -d -p 5672:5672 -p 15672:15672 --name myrabbitmq rabbitmq

3. 浏览器输入：http://localhost:15672打开rabbitmq后台管理页面

     若不能访问则在容器cli里输入：rabbitmq-plugins enable rabbitmq_managementq.sh 

      账号和密码都是 guest

   <img src="/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427210503772.png" alt="image-20200427210503772" style="zoom:80%;" />

4. 定义三种类型交换器

   ![image-20200427212907984](/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427212907984.png)

5. 定义四个消息队列

   ![image-20200427213009788](/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427213009788.png)

6. **交换器绑定队列的规则** ：To：这个交换器绑定到哪个队列 Routing key：消息的路由键是什么才会发送给这个队列

   ![image-20200427212741686](/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427212741686.png)

## SpringBoot 热部署

Spring Boot Devtools（推荐）

- 引入依赖

  ```xml
     <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-devtools</artifactId>
          </dependency>
  ```

- 开启热部署第一种方式：ctrl+F9---》就是build的快捷键

- 第二种方式：搜索compiler，在右边钩上build project automatically

![image-20200427215018751](/Volumes/MAC文件/MyLearning/java/框架/images/image-20200427215018751.png)