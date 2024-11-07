import { Label } from "@prisma/client"
import ForbiddenError403 from "../../utils/errors/ForbiddenError403"
import NotFoundError404 from "../../utils/errors/NotFoundError404"
import GroupRepository from "../group/GroupRepository"
import LabelRepository from "./LabelRepository"
import { ImportLabelDto } from "./types/ImportLabelDto"

export default class LabelService {
  constructor(
    private readonly labelRepository = new LabelRepository(),
    private readonly groupRepository = new GroupRepository()
  ) {}

  async findLabelsByGroup(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup({
      userId: requesterId,
      groupId,
    })

    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group")

    const labels = await this.labelRepository.findLabelsByGroup(groupId)
    return labels
  }

  async createLabel(label: Label, groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup({
      userId: requesterId,
      groupId,
    })

    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to add labels to this group"
      )

    const labelsFromGroup = await this.labelRepository.findLabelsByGroup(
      groupId
    )
    label.position = labelsFromGroup.length + 1

    const createdLabel = await this.labelRepository.createLabel(label, groupId)
    return createdLabel
  }

  async updateLabel(label: Label, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup({
      userId: requesterId,
      groupId: label.groupId,
    })
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to edit this label")

    const editedLabel = await this.labelRepository.updateLabel(label)
    return editedLabel
  }

  async deleteLabel(labelId: string, requesterId: string) {
    const label = await this.labelRepository.findLabelById(labelId)
    if (!label) throw new NotFoundError404("Label not found")

    const isAllowed = await this.groupRepository.userBelongsToGroup({
      userId: requesterId,
      groupId: label.groupId,
    })

    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group")

    const deletedLabel = await this.labelRepository.deleteLabel(labelId)
    return deletedLabel
  }

  async findLabelsToImport(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup({
      userId: requesterId,
      groupId,
    })

    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group")

    const allGroups = await this.groupRepository.findGroupsByUser(requesterId)
    const otherGroups = allGroups.filter((group) => group.id !== groupId)
    const otherGroupIds = otherGroups.map((group) => group.id)

    const labels = await this.labelRepository.findLabelsByGroupIds(
      otherGroupIds
    )
    return labels
  }

  async importLabels(params: {
    groupId: string
    labelDtos: ImportLabelDto[]
    requesterId: string
  }) {
    const { groupId, labelDtos, requesterId } = params

    const isAllowed = await this.groupRepository.userBelongsToGroup({
      userId: requesterId,
      groupId,
    })

    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group")

    const importedLabels = await this.labelRepository.createManyLabels(
      groupId,
      labelDtos
    )
    return importedLabels
  }

  updateMany(labels: Label[], requesterId: string) {
    const userCanChangeLabels = this.#userCanChangeLabels(requesterId, labels)
    if (!this.#userCanChangeLabels(requesterId, labels))
      throw new ForbiddenError403("You're not allowed to edit these labels")

    const updatedLabels = this.labelRepository.updateMany(labels)
    return updatedLabels
  }

  #userCanChangeLabels(requesterId: string, labels: Label[]) {
    const groupIds = labels.map((label) => label.groupId)
    const uniqueGroupIds = [...new Set(groupIds)]
    const isAllowed = uniqueGroupIds.every((groupId) => {
      return this.groupRepository.userBelongsToGroup({
        userId: requesterId,
        groupId,
      })
    })

    return isAllowed
  }
}
