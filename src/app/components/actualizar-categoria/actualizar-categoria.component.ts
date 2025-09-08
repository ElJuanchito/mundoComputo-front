import { Component, type OnInit, Input, Output, EventEmitter, type OnChanges } from "@angular/core"
import { type FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { InventarioService } from "../../services/inventario.service"
import type { UpdateCategoriaDTO } from "../../dtos/categoria/update-categoria-dto"
import type { CategoriaInfoDTO } from "../../dtos/categoria/categoria-info-dto"

