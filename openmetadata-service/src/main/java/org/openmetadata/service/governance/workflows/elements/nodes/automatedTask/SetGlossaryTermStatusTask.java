package org.openmetadata.service.governance.workflows.elements.nodes.automatedTask;

import static org.openmetadata.service.governance.workflows.Workflow.getFlowableElementId;

import org.flowable.bpmn.model.BoundaryEvent;
import org.flowable.bpmn.model.BpmnModel;
import org.flowable.bpmn.model.EndEvent;
import org.flowable.bpmn.model.FieldExtension;
import org.flowable.bpmn.model.Process;
import org.flowable.bpmn.model.SequenceFlow;
import org.flowable.bpmn.model.ServiceTask;
import org.flowable.bpmn.model.StartEvent;
import org.flowable.bpmn.model.SubProcess;
import org.openmetadata.schema.governance.workflows.elements.nodes.automatedTask.SetGlossaryTermStatusTaskDefinition;
import org.openmetadata.service.governance.workflows.elements.NodeInterface;
import org.openmetadata.service.governance.workflows.elements.nodes.automatedTask.impl.SetGlossaryTermStatusImpl;
import org.openmetadata.service.governance.workflows.flowable.builders.EndEventBuilder;
import org.openmetadata.service.governance.workflows.flowable.builders.FieldExtensionBuilder;
import org.openmetadata.service.governance.workflows.flowable.builders.ServiceTaskBuilder;
import org.openmetadata.service.governance.workflows.flowable.builders.StartEventBuilder;
import org.openmetadata.service.governance.workflows.flowable.builders.SubProcessBuilder;

public class SetGlossaryTermStatusTask implements NodeInterface {
  private final SubProcess subProcess;
  private final BoundaryEvent runtimeExceptionBoundaryEvent;

  public SetGlossaryTermStatusTask(SetGlossaryTermStatusTaskDefinition nodeDefinition) {
    String subProcessId = nodeDefinition.getName();

    SubProcess subProcess = new SubProcessBuilder().id(subProcessId).build();

    StartEvent startEvent =
        new StartEventBuilder().id(getFlowableElementId(subProcessId, "startEvent")).build();

    ServiceTask setGlossaryTermStatus =
        getSetGlossaryTermStatusServiceTask(
            subProcessId, nodeDefinition.getConfig().getGlossaryTermStatus().toString());

    EndEvent endEvent =
        new EndEventBuilder().id(getFlowableElementId(subProcessId, "endEvent")).build();

    subProcess.addFlowElement(startEvent);
    subProcess.addFlowElement(setGlossaryTermStatus);
    subProcess.addFlowElement(endEvent);

    subProcess.addFlowElement(new SequenceFlow(startEvent.getId(), setGlossaryTermStatus.getId()));
    subProcess.addFlowElement(new SequenceFlow(setGlossaryTermStatus.getId(), endEvent.getId()));

    this.runtimeExceptionBoundaryEvent = getRuntimeExceptionBoundaryEvent(subProcess);
    this.subProcess = subProcess;
  }

  @Override
  public BoundaryEvent getRuntimeExceptionBoundaryEvent() {
    return runtimeExceptionBoundaryEvent;
  }

  private ServiceTask getSetGlossaryTermStatusServiceTask(String subProcessId, String status) {
    FieldExtension statusExpr =
        new FieldExtensionBuilder().fieldName("statusExpr").fieldValue(status).build();

    ServiceTask serviceTask =
        new ServiceTaskBuilder()
            .id(getFlowableElementId(subProcessId, "setGlossaryTermStatus"))
            .implementation(SetGlossaryTermStatusImpl.class.getName())
            .build();
    serviceTask.getFieldExtensions().add(statusExpr);
    return serviceTask;
  }

  public void addToWorkflow(BpmnModel model, Process process) {
    process.addFlowElement(subProcess);
    process.addFlowElement(runtimeExceptionBoundaryEvent);
  }
}
