---
本指南将帮助您设置摄取框架和连接器
---

![Python version 3.8+](https://img.shields.io/badge/python-3.8%2B-blue)

OpenMetadata Ingestion 是一个简单的框架，用于构建连接器并通过 OpenMetadata API 摄取各种系统的元数据。它可以在编排框架（例如 Apache Airflow）中用于摄取元数据。

**先决条件**

Python >= 3.8.x

### 文档

请参阅此处的文档 https://docs.open-metadata.org/connectors

<img referrerpolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=c1a30c7c-6dc7-4928-95bf-6ee08ca6aa6a" />

### 拓扑运行器

所有摄取工作流都通过 TopologyRunner 运行。

该流程如下图所示。

**TopologyRunner 标准流**

![image](../openmetadata-docs/images/v1.4/features/ingestion/workflows/metadata/multithreading/single-thread-flow.png)

**TopologyRunner 多线程流**

![image](../openmetadata-docs/images/v1.4/features/ingestion/workflows/metadata/multithreading/multi-thread-flow.png)
