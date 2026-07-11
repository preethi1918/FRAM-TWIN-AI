package com.farmtwin.controller;

import com.farmtwin.dto.Requests.IrrigationRequest;
import com.farmtwin.service.MLClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/irrigation")
public class IrrigationController {

    private final MLClientService mlClientService;

    @Autowired
    public IrrigationController(MLClientService mlClientService) {
        this.mlClientService = mlClientService;
    }

    @PostMapping("/recommend")
    public Mono<Map> recommendIrrigation(@Valid @RequestBody IrrigationRequest request) {
        return mlClientService.recommendIrrigation(request);
    }
}
