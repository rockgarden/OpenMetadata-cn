# 了解代码布局

将本文档作为开始使用 OpenMetadata 进行开发的快速入门指南。下面，我们将讨论以下主题：

- 模式（元数据模型）
- 应用程序接口
- 系统和组件

## 模式（元数据模型）

OpenMetadata 采用模式优先的方法来建立元数据模型。我们定义实体、类型、API 请求和实体之间的关系。我们使用 JSON Schema 词汇表定义 OpenMetadata 模式。

我们使用 [pom.xml](https://github.com/open-metadata/OpenMetadata/blob/main/openmetadata-service/pom.xml#L517) 中定义的 jsonschema2pojo-maven-plugin 插件将使用 [JSON Schema](https://json-schema.org/) 定义的模型转换为普通 Java 对象（POJO）。您可以在 `OpenMetadata/openmetadata-service/target/generated-sources/jsonschema2pojo` 下找到生成的 POJO。

### 实体

你可以在 [OpenMetadata/openmetadata-spec/src/main/resources/json/schema/entity](https://github.com/open-metadata/OpenMetadata/tree/main/openmetadata-spec/src/main/resources/json/schema/entity) 目录中找到已定义的实体。目前，OpenMetadata 支持以下实体：

- data
- feed
- policies
- services
- tags
- teams

### 类型

所有 OpenMetadata 支持的类型都定义在 [OpenMetadata/openmetadata-spec/src/main/resources/json/schema/type](https://github.com/open-metadata/OpenMetadata/tree/main/openmetadata-spec/src/main/resources/json/schema/type) 下。

### API 请求对象

API 请求对象定义在 [OpenMetadata/openmetadata-spec/src/main/resources/json/schema/api](https://github.com/open-metadata/OpenMetadata/tree/main/openmetadata-spec/src/main/resources/json/schema/api) 下。

## 应用程序接口

OpenMetadata 使用 [Dropwizard](https://www.dropwizard.io/) Java 框架来构建 REST API。你可以在 [OpenMetadata/openmetadata-service/src/main/java/org/openmetadata/service/resources](https://github.com/open-metadata/OpenMetadata/tree/main/openmetadata-service/src/main/java/org/openmetadata/service/resources) 目录中找到已定义的 API。OpenMetadata 使用 Swagger 按照 OpenAPI 标准生成 API 文档。

## 系统和组件

OpenMetadata 组件与高级交互概述：

![System and Components](../../../../images/v1.5/developers/architecture/architecture.png)

### 事件

OpenMetadata 以事件的形式捕获对实体的更改，并将其存储在 OpenMetadata 服务器数据库中。OpenMetadata 还会在 Elasticsearch 中为变更事件建立索引，以便进行搜索。

事件处理程序定义在 [OpenMetadata/openmetadata-service/src/main/java/org/openmetadata/service/events](https://github.com/open-metadata/OpenMetadata/tree/main/openmetadata-service/src/main/java/org/openmetadata/service/events) 下，并使用 ContainerResponseFilter 全局应用于任何传出响应。

### 数据库

OpenMetadata 使用 MySQL 或 Postgres 作为元数据目录。目录代码位于 [OpenMetadata/openmetadata-service/src/main/java/org/openmetadata/service/jdbi3](https://github.com/open-metadata/OpenMetadata/tree/main/openmetadata-service/src/main/java/org/openmetadata/service/jdbi3) 目录中。

数据库实体表通过脚本 [OpenMetadata/bootstrap/openmetadata-ops.sh](https://github.com/open-metadata/OpenMetadata/blob/main/bootstrap/openmetadata-ops.sh) 创建。[Flyway](https://flywaydb.org/) 用于管理数据库表版本。

### Elasticsearch

OpenMetadata 使用 Elasticsearch 来存储实体变更事件，并可通过搜索索引进行搜索。[OpenMetadata/openmetadata-service/src/main/java/org/openmetadata/service/elasticsearch/ElasticSearchEventPublisher.java](https://github.com/open-metadata/OpenMetadata/blob/main/openmetadata-service/src/main/java/org/openmetadata/service/elasticsearch/ElasticSearchEventPublisher.java) 负责捕获变更事件并更新 Elasticsearch。

当运行 [OpenMetadata/ingestion/pipelines/metadata_to_es.json](https://github.com/open-metadata/OpenMetadata/blob/main/ingestion/pipelines/metadata_to_es.json) ingestion 连接器时，会创建 Elasticsearch 索引。

### 身份验证/授权

OpenMetadata 使用 Google OAuth 进行身份验证。所有传入请求都会通过使用 Google OAuth 提供商验证 JWT 令牌进行过滤。访问控制由 [Authorizer](https://github.com/open-metadata/OpenMetadata/blob/main/openmetadata-service/src/main/java/org/openmetadata/service/security/Authorizer.java) 提供。

有关身份验证和授权配置，请参阅配置文件 OpenMetadata [/conf/openmetadata.yaml](https://github.com/open-metadata/OpenMetadata/blob/main/conf/openmetadata.yaml)。

### 摄取

摄取是一个简单的 Python 框架，用于将外部来源的元数据摄取到 OpenMetadata 中。

#### 连接器

OpenMetadata 为元数据摄取定义并使用了一组称为连接器（Connectors）的组件。每个数据服务都需要自己的连接器。有关为新服务开发连接器的详情，请参阅有关如何构建连接器的文档。

1. Workflow [`OpenMetadata/ingestion/src/metadata/ingestion/api/workflow.py`](https://github.com/open-metadata/OpenMetadata/blob/main/ingestion/src/metadata/ingestion/api/workflow.py)
2. Source [`OpenMetadata/ingestion/src/metadata/ingestion/api/source.py`](https://github.com/open-metadata/OpenMetadata/blob/main/ingestion/src/metadata/ingestion/api/source.py)
3. Processor [`OpenMetadata/ingestion/src/metadata/ingestion/api/processor.py`](https://github.com/open-metadata/OpenMetadata/blob/main/ingestion/src/metadata/ingestion/api/processor.py)
4. Sink [`OpenMetadata/ingestion/src/metadata/ingestion/api/sink.py`](https://github.com/open-metadata/OpenMetadata/blob/main/ingestion/src/metadata/ingestion/api/sink.py)
5. Stage [`OpenMetadata/ingestion/src/metadata/ingestion/api/stage.py`](https://github.com/open-metadata/OpenMetadata/blob/main/ingestion/src/metadata/ingestion/api/stage.py)
6. BulkSink [`OpenMetadata/ingestion/src/metadata/ingestion/api/bulk_sink.py`](https://github.com/open-metadata/OpenMetadata/blob/main/ingestion/src/metadata/ingestion/api/bulk_sink.py)

工作流是一个简单的协调任务，可根据 OpenMetadata/ingestion/examples/workflows 下的配置运行 Source、Processor、Sink、Stage 和 BulkSink。

目前已经开发了一些常用的连接器，可在以下目录中找到：

1. Source → [`OpenMetadata/ingestion/src/metadata/ingestion/source`](https://github.com/open-metadata/OpenMetadata/tree/main/ingestion/src/metadata/ingestion/source)
2. Processor → [`OpenMetadata/ingestion/src/metadata/ingestion/processor`](https://github.com/open-metadata/OpenMetadata/tree/main/ingestion/src/metadata/ingestion/processor)
3. Sink → [`OpenMetadata/ingestion/src/metadata/ingestion/sink`](https://github.com/open-metadata/OpenMetadata/tree/main/ingestion/src/metadata/ingestion/sink)
4. Stage → [`OpenMetadata/ingestion/src/metadata/ingestion/stage`](https://github.com/open-metadata/OpenMetadata/tree/main/ingestion/src/metadata/ingestion/stage)
5. BulkSink → [`OpenMetadata/ingestion/src/metadata/ingestion/bulksink`](https://github.com/open-metadata/OpenMetadata/tree/main/ingestion/src/metadata/ingestion/bulksink)

#### Airflow

为简单起见，OpenMetadata 使用基于拉的模式从外部来源摄取元数据。OpenMetadata 使用 Apache Airflow 来协调摄取工作流。

有关 DAG 的参考定义，请参见 [OpenMetadata/ingestion/examples/airflow/dags](https://github.com/open-metadata/OpenMetadata/tree/main/ingestion/examples/airflow/dags) 目录。

#### JsonSchema Python 类型

使用 [Makefile](https://github.com/open-metadata/OpenMetadata/blob/main/Makefile) 中的 make generate 命令，可以为使用 Json Schema 定义的 OpenMetadata 模型生成 Python 类型。生成的文件位于 OpenMetadata/ingestion/src/metadata/generated 目录中。
