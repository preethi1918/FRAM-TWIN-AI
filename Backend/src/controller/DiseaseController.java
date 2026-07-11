package com.farmtwin.controller;

import com.farmtwin.dto.Requests.DiseaseRequest;
import com.farmtwin.service.MLClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/disease")
public class DiseaseController {

    private final MLClientService mlClientService;

    @Autowired
    public DiseaseController(MLClientService mlClientService) {
        this.mlClientService = mlClientService;
    }

    @PostMapping("/risk")
    public Mono<Map> predictDiseaseRisk(@Valid @RequestBody DiseaseRequest request) {
        return mlClientService.predictDiseaseRisk(request);
    }
}
